import { 
  School, Partner, Student, DailyLog, SoilSample, 
  FarmerOutreach, Campaign, BudgetLine, 
  InventoryItem, AuditLog, NotificationItem, ProgramTargets,
  Role, ChecklistItem
} from '../types';
import { storageCore, STORAGE_KEYS } from './storage/storageCore';
import { schoolStorage } from './storage/schoolStorage';
import { partnerStorage } from './storage/partnerStorage';
import { studentStorage } from './storage/studentStorage';
import { dailyLogStorage } from './storage/dailyLogStorage';
import { soilSampleStorage } from './storage/soilSampleStorage';
import { outreachStorage } from './storage/outreachStorage';
import { budgetInventoryStorage } from './storage/budgetInventoryStorage';
import { auditNotificationStorage } from './storage/auditNotificationStorage';
import { 
  SEED_SCHOOLS, SEED_PARTNERS, DEFAULT_PROGRAM_TARGETS,
  generateStudentsForSchool, generateDailyLogsForSchool,
  generateSoilSamples, generateFarmerOutreach, generateCampaigns,
  generateInventory, generateAuditLogs, generateNotifications
} from '../data/seedData';
import { INITIAL_BUDGET_LINES } from '../data/budgetData';

export class StorageService {
  public init(): void {
    if (storageCore.getInitialized()) return;
    storageCore.setInitialized(true);

    storageCore.runMigrations();

    // Check if initial seeding needed
    if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
      this.resetAllData();
    }
  }

  public resetAllData(): void {
    storageCore.clearCache();

    // Reset schools
    storageCore.safeWrite(STORAGE_KEYS.SCHOOLS, SEED_SCHOOLS);

    // Reset partners
    storageCore.safeWrite(STORAGE_KEYS.PARTNERS, SEED_PARTNERS);

    // Reset students
    const initialStudents: Student[] = [];
    ['SCH-01', 'SCH-02', 'SCH-03'].forEach(sId => {
      initialStudents.push(...generateStudentsForSchool(sId, 18));
    });
    storageCore.safeWrite(STORAGE_KEYS.STUDENTS, initialStudents);

    // Reset daily logs
    const initialLogs: DailyLog[] = [];
    SEED_SCHOOLS.forEach(sch => {
      if (sch.status === 'Running') {
        initialLogs.push(...generateDailyLogsForSchool(sch, 28));
      }
    });
    storageCore.safeWrite(STORAGE_KEYS.DAILY_LOGS, initialLogs);

    // Reset samples, outreach, inventory, budget, logs
    storageCore.safeWrite(STORAGE_KEYS.SOIL_SAMPLES, generateSoilSamples());
    storageCore.safeWrite(STORAGE_KEYS.OUTREACH, generateFarmerOutreach());
    storageCore.safeWrite(STORAGE_KEYS.CAMPAIGNS, generateCampaigns());
    storageCore.safeWrite(STORAGE_KEYS.BUDGET, INITIAL_BUDGET_LINES);
    storageCore.safeWrite(STORAGE_KEYS.INVENTORY, generateInventory());
    storageCore.safeWrite(STORAGE_KEYS.AUDIT_LOGS, generateAuditLogs());
    storageCore.safeWrite(STORAGE_KEYS.NOTIFICATIONS, generateNotifications());
    storageCore.safeWrite(STORAGE_KEYS.TARGETS, DEFAULT_PROGRAM_TARGETS);
    storageCore.safeRemove(STORAGE_KEYS.DRAFT_DAILY_LOG);

    storageCore.notify();
  }

  public runMigrations(): void {
    storageCore.runMigrations();
  }

  public clearCache(): void {
    storageCore.clearCache();
  }

  // --- SCHOOLS ---
  public getSchools(): School[] {
    this.init();
    return schoolStorage.getSchools();
  }

  public getSchool(id: string): School | undefined {
    this.init();
    return schoolStorage.getSchool(id);
  }

  public saveSchool(school: School): School {
    this.init();
    return schoolStorage.saveSchool(school);
  }

  // --- PARTNERS ---
  public getPartners(): Partner[] {
    this.init();
    return partnerStorage.getPartners();
  }

  public getPartner(id: string): Partner | undefined {
    this.init();
    return partnerStorage.getPartner(id);
  }

  public savePartner(partner: Partner): Partner {
    this.init();
    return partnerStorage.savePartner(partner);
  }

  // --- STUDENTS ---
  public getStudents(schoolId?: string): Student[] {
    this.init();
    return studentStorage.getStudents(schoolId);
  }

  public getStudent(id: string): Student | undefined {
    this.init();
    return studentStorage.getStudent(id);
  }

  public saveStudent(student: Student): Student {
    this.init();
    return studentStorage.saveStudent(student);
  }

  public issueCertificate(studentId: string, actorName: string = 'Arkashine Super Admin'): { success: boolean; message: string; student?: Student } {
    this.init();
    const res = studentStorage.issueCertificate(studentId, actorName);
    if (res.success && res.student) {
      this.addAuditLog({
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName,
        actorRole: 'arkashine',
        action: 'CERTIFICATE_ISSUED',
        details: `Issued Soil Partner Certificate ${res.student.certificateId} for ${res.student.name} (${res.student.rollNo})`,
        schoolId: res.student.schoolId
      });
    }
    return res;
  }

  public bulkIssueEligibleCertificates(schoolId: string, actorName: string = 'Arkashine Super Admin'): { count: number; message: string } {
    this.init();
    return studentStorage.bulkIssueEligibleCertificates(schoolId, actorName);
  }

  public getStudentByVerificationHash(hash: string): { student: Student; school?: School } | null {
    this.init();
    return studentStorage.getStudentByVerificationHash(hash);
  }

  // --- DAILY LOGS ---
  public getDailyLogs(schoolId?: string): DailyLog[] {
    this.init();
    return dailyLogStorage.getDailyLogs(schoolId);
  }

  public getDailyLog(schoolId: string, dayNumber: number): DailyLog | undefined {
    this.init();
    return dailyLogStorage.getDailyLog(schoolId, dayNumber);
  }

  public saveDailyLog(log: DailyLog, actorName: string = 'Faculty'): DailyLog {
    this.init();
    const saved = dailyLogStorage.saveDailyLog(log, actorName);
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole: 'faculty',
      action: 'DAILY_LOG_UPDATED',
      details: `Saved Day ${log.dayNumber} log for ${log.schoolId} (${log.hoursTaught} hrs taught).`,
      schoolId: log.schoolId
    });
    return saved;
  }

  public saveAttendanceForDay(
    schoolId: string,
    dayNumber: number,
    attendanceMap: Record<string, 'present' | 'absent' | 'late'>
  ): { success: boolean; stats: { present: number; absent: number; late: number; rate: number } } {
    this.init();
    return dailyLogStorage.saveAttendanceForDay(schoolId, dayNumber, attendanceMap);
  }

  public getDraftDailyLog(): Partial<DailyLog> | null {
    this.init();
    return dailyLogStorage.getDraftDailyLog();
  }

  public saveDraftDailyLog(draft: Partial<DailyLog>): void {
    this.init();
    dailyLogStorage.saveDraftDailyLog(draft);
  }

  public clearDraftDailyLog(): void {
    this.init();
    dailyLogStorage.clearDraftDailyLog();
  }

  // --- SOIL SAMPLES ---
  public getSoilSamples(schoolId?: string): SoilSample[] {
    this.init();
    return soilSampleStorage.getSoilSamples(schoolId);
  }

  public saveSoilSample(sample: SoilSample): SoilSample {
    this.init();
    return soilSampleStorage.saveSoilSample(sample);
  }

  // --- OUTREACH & CAMPAIGNS ---
  public getFarmerOutreach(schoolId?: string): FarmerOutreach[] {
    this.init();
    return outreachStorage.getFarmerOutreach(schoolId);
  }

  public saveFarmerOutreach(item: FarmerOutreach): FarmerOutreach {
    this.init();
    return outreachStorage.saveFarmerOutreach(item);
  }

  public getCampaigns(schoolId?: string): Campaign[] {
    this.init();
    return outreachStorage.getCampaigns(schoolId);
  }

  public saveCampaign(item: Campaign): Campaign {
    this.init();
    return outreachStorage.saveCampaign(item);
  }

  // --- BUDGET & INVENTORY ---
  public getBudgetLines(): BudgetLine[] {
    this.init();
    return budgetInventoryStorage.getBudgetLines();
  }

  public saveBudgetLine(line: BudgetLine): BudgetLine {
    this.init();
    return budgetInventoryStorage.saveBudgetLine(line);
  }

  public getInventory(schoolId?: string): InventoryItem[] {
    this.init();
    return budgetInventoryStorage.getInventory(schoolId);
  }

  public saveInventory(item: InventoryItem): InventoryItem {
    this.init();
    return budgetInventoryStorage.saveInventory(item);
  }

  public getProgramTargets(): ProgramTargets {
    this.init();
    return budgetInventoryStorage.getProgramTargets();
  }

  public saveProgramTargets(targets: ProgramTargets): ProgramTargets {
    this.init();
    return budgetInventoryStorage.saveProgramTargets(targets);
  }

  // --- AUDIT & NOTIFICATIONS ---
  public getAuditLogs(): AuditLog[] {
    this.init();
    return auditNotificationStorage.getAuditLogs();
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.init();
    return auditNotificationStorage.addAuditLog(log);
  }

  public getNotifications(role?: Role): NotificationItem[] {
    this.init();
    return auditNotificationStorage.getNotifications(role);
  }

  public markNotificationRead(id: string): void {
    this.init();
    auditNotificationStorage.markNotificationRead(id);
  }

  // --- ELIGIBILITY & ENROLLMENT ---
  public updateSchoolEligibilityCheck(schoolId: string, items: ChecklistItem[], evaluator: string): School {
    this.init();
    const school = schoolStorage.updateSchoolEligibilityCheck(schoolId, items, evaluator);
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: evaluator,
      actorRole: 'partner',
      action: 'ELIGIBILITY_EVALUATION',
      details: `Evaluated ${school.name}: Score ${school.eligibility.score}%, Result: ${school.eligibility.result}`,
      schoolId: school.id
    });
    return school;
  }

  public enrollSchool(schoolId: string, actorName: string = 'Arkashine Admin'): { success: boolean; message: string } {
    this.init();
    const school = this.getSchool(schoolId);
    if (!school) return { success: false, message: 'School not found' };

    if (school.eligibility.result === 'Not_Eligible') {
      return { 
        success: false, 
        message: `School cannot be enrolled because it is deemed Not Eligible (${school.eligibility.score}%). Resolve safety and infrastructure disqualifiers first.` 
      };
    }

    if (school.eligibility.result === 'Pending' || school.eligibility.items.length === 0) {
      return { 
        success: false, 
        message: 'Eligibility evaluation has not been completed. Please complete and submit the checklist.' 
      };
    }

    if (school.status === 'Approved' || school.status === 'Lab_Setup') {
      school.status = 'Enrolled';
    } else if (school.status === 'Enrolled') {
      school.status = 'Running';
      school.currentDay = 1;
      if (this.getStudents(schoolId).length === 0) {
        const students = generateStudentsForSchool(schoolId, 18);
        const existing = this.getStudents();
        storageCore.safeWrite(STORAGE_KEYS.STUDENTS, [...existing, ...students]);
      }
      if (this.getDailyLogs(schoolId).length === 0) {
        const logs = generateDailyLogsForSchool(school, 28);
        const existingLogs = this.getDailyLogs();
        storageCore.safeWrite(STORAGE_KEYS.DAILY_LOGS, [...existingLogs, ...logs]);
      }
    }

    this.saveSchool(school);
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole: 'arkashine',
      action: 'SCHOOL_STATUS_ADVANCED',
      details: `Advanced ${school.name} to status: ${school.status}`,
      schoolId: school.id
    });

    return { success: true, message: `School successfully moved to ${school.status}` };
  }
}

export const storageService = new StorageService();
export * from './storage/useStorage';
