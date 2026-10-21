import { DailyLog } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateDailyLogsForSchool } from '../../data/seedData';
import { schoolStorage } from './schoolStorage';

export class DailyLogStorage {
  private getInitialDailyLogs(): DailyLog[] {
    const list: DailyLog[] = [];
    const schools = schoolStorage.getSchools();
    schools.forEach(sch => {
      if (sch.status === 'Running') {
        list.push(...generateDailyLogsForSchool(sch, 28));
      }
    });
    return list;
  }

  public getDailyLogs(schoolId?: string): DailyLog[] {
    const list = storageCore.safeParse<DailyLog[]>(STORAGE_KEYS.DAILY_LOGS, this.getInitialDailyLogs());
    return schoolId ? list.filter(l => l.schoolId === schoolId) : list;
  }

  public getDailyLog(schoolId: string, dayNumber: number): DailyLog | undefined {
    return this.getDailyLogs(schoolId).find(l => l.dayNumber === dayNumber);
  }

  public saveDailyLog(log: DailyLog, _actorName: string = 'Faculty'): DailyLog {
    const list = [...this.getDailyLogs()];
    const idx = list.findIndex(l => l.id === log.id || (l.schoolId === log.schoolId && l.dayNumber === log.dayNumber));
    if (idx >= 0) {
      list[idx] = log;
    } else {
      list.push(log);
    }
    storageCore.safeWrite(STORAGE_KEYS.DAILY_LOGS, list);

    // Recalculate school metrics
    const school = schoolStorage.getSchool(log.schoolId);
    if (school) {
      if (log.dayNumber > school.currentDay) {
        school.currentDay = log.dayNumber;
        schoolStorage.saveSchool(school);
      }
    }

    return log;
  }

  // --- DRAFT DAILY LOG (for offline resilience) ---
  public getDraftDailyLog(): Partial<DailyLog> | null {
    return storageCore.safeParse<Partial<DailyLog> | null>(STORAGE_KEYS.DRAFT_DAILY_LOG, null);
  }

  public saveDraftDailyLog(draft: Partial<DailyLog>): void {
    storageCore.safeWrite(STORAGE_KEYS.DRAFT_DAILY_LOG, draft);
  }

  public clearDraftDailyLog(): void {
    storageCore.safeRemove(STORAGE_KEYS.DRAFT_DAILY_LOG);
  }
}

export const dailyLogStorage = new DailyLogStorage();
