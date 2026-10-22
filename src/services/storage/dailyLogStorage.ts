import { DailyLog } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateDailyLogsForSchool } from '../../data/seedData';
import { schoolStorage } from './schoolStorage';
import { studentStorage } from './studentStorage';

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

    // Synchronize enrolled student attendance records
    if (log.studentAttendance && Object.keys(log.studentAttendance).length > 0) {
      const schoolLogs = list.filter(l => l.schoolId === log.schoolId);
      const schoolStudents = studentStorage.getStudents(log.schoolId);
      schoolStudents.forEach(stu => {
        let presentDays = 0;
        let loggedDays = 0;
        schoolLogs.forEach(sl => {
          if (sl.studentAttendance && sl.studentAttendance[stu.id]) {
            loggedDays++;
            if (sl.studentAttendance[stu.id] === 'present') {
              presentDays += 1;
            } else if (sl.studentAttendance[stu.id] === 'late') {
              presentDays += 0.5;
            }
          }
        });
        if (loggedDays > 0) {
          stu.totalPresentDays = Math.round(presentDays);
          stu.totalLoggedDays = loggedDays;
          stu.attendanceRate = Math.round((presentDays / loggedDays) * 100);
          stu.certificateStatus = stu.attendanceRate >= 80 ? 'Eligible' : 'Not_Eligible';
          studentStorage.saveStudent(stu);
        }
      });
    }

    return log;
  }

  // --- SAVE ATTENDANCE FOR ANY DAY & RECALCULATE STUDENT RATES ---
  public saveAttendanceForDay(
    schoolId: string,
    dayNumber: number,
    attendanceMap: Record<string, 'present' | 'absent' | 'late'>
  ): { success: boolean; stats: { present: number; absent: number; late: number; rate: number } } {
    const list = this.getDailyLogs();
    let log = list.find(l => l.schoolId === schoolId && l.dayNumber === dayNumber);
    
    if (!log) {
      log = {
        id: `LOG-${schoolId}-D${dayNumber}`,
        schoolId,
        date: new Date().toISOString().split('T')[0],
        dayNumber,
        facultyId: 'USR-FAC-01',
        facultyName: 'Dr. Anjali Patil',
        moduleNumber: Math.min(6, Math.ceil(dayNumber / 4.5)),
        moduleTitle: `Module ${Math.min(6, Math.ceil(dayNumber / 4.5))}: Hands-on Soil Testing`,
        topicsCovered: ['Daily Student Lab Attendance & Sample Prep'],
        sessionType: 'Practical',
        hoursTaught: 2.5,
        plannedHours: 2.5,
        isDelayed: false,
        status: 'On_Time',
        studentAttendance: { ...attendanceMap },
        samplesTestedCount: 12,
        farmersReachedCount: 15,
        campaignsCount: 1,
        stockUsed: 'Standard daily test reagents',
        photos: ['/assets/images/module-soil-testing.png'],
        isLocked: false,
        submittedAt: new Date().toISOString()
      };
    } else {
      log.studentAttendance = { ...attendanceMap };
      log.status = 'On_Time';
      log.submittedAt = new Date().toISOString();
    }

    this.saveDailyLog(log);

    const total = Object.keys(attendanceMap).length || 20;
    const present = Object.values(attendanceMap).filter(v => v === 'present').length;
    const late = Object.values(attendanceMap).filter(v => v === 'late').length;
    const absent = Object.values(attendanceMap).filter(v => v === 'absent').length;
    const rate = Math.round(((present + late * 0.5) / total) * 100);

    return {
      success: true,
      stats: { present, absent, late, rate }
    };
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
