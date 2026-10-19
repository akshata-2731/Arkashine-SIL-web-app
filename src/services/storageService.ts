import { 
  School, Partner, Student, DailyLog, SoilSample, 
  FarmerOutreach, Campaign, Certificate, BudgetLine, 
  InventoryItem, AuditLog, NotificationItem, ProgramTargets,
  Role, ChecklistItem, EligibilityResult
} from '../types';
import { 
  SEED_SCHOOLS, SEED_PARTNERS, DEFAULT_PROGRAM_TARGETS,
  generateStudentsForSchool, generateDailyLogsForSchool,
  generateSoilSamples, generateFarmerOutreach, generateCampaigns,
  generateInventory, generateAuditLogs, generateNotifications 
} from '../data/seedData';
import { INITIAL_BUDGET_LINES } from '../data/budgetData';

const STORAGE_KEYS = {
  SCHOOLS: 'arkashine_schools_v1',
  PARTNERS: 'arkashine_partners_v1',
  STUDENTS: 'arkashine_students_v1',
  DAILY_LOGS: 'arkashine_daily_logs_v1',
  SOIL_SAMPLES: 'arkashine_soil_samples_v1',
  OUTREACH: 'arkashine_outreach_v1',
  CAMPAIGNS: 'arkashine_campaigns_v1',
  BUDGET: 'arkashine_budget_v1',
  INVENTORY: 'arkashine_inventory_v1',
  AUDIT_LOGS: 'arkashine_audit_v1',
  NOTIFICATIONS: 'arkashine_notifications_v1',
  TARGETS: 'arkashine_targets_v1',
  CURRENT_USER: 'arkashine_current_user_v1',
  DRAFT_DAILY_LOG: 'arkashine_draft_daily_log_v1'
};

class StorageService {
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;

    if (!localStorage.getItem(STORAGE_KEYS.SCHOOLS)) {
      this.resetAllData();
    }
    this.isInitialized = true;
  }

  public resetAllData() {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(SEED_SCHOOLS));
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(SEED_PARTNERS));
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(DEFAULT_PROGRAM_TARGETS));
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(INITIAL_BUDGET_LINES));
    localStorage.setItem(STORAGE_KEYS.SOIL_SAMPLES, JSON.stringify(generateSoilSamples()));
    localStorage.setItem(STORAGE_KEYS.OUTREACH, JSON.stringify(generateFarmerOutreach()));
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(generateCampaigns()));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(generateInventory()));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(generateAuditLogs()));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(generateNotifications()));

    // Generate students for running and lab setup schools
    const allStudents: Student[] = [];
    for (const school of SEED_SCHOOLS) {
      if (school.status === 'Running' || school.status === 'Lab_Setup') {
        const count = school.id === 'SCH-02' ? 19 : (school.id === 'SCH-03' ? 17 : 18);
        const schoolStudents = generateStudentsForSchool(school.id, count);
        allStudents.push(...schoolStudents);
      }
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(allStudents));

    // Generate daily logs for running schools
    const allLogs: DailyLog[] = [];
    for (const school of SEED_SCHOOLS) {
      if (school.status === 'Running') {
        allLogs.push(...generateDailyLogsForSchool(school, 28));
      }
    }
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(allLogs));
  }

  // --- SCHOOLS ---
  public getSchools(): School[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    return data ? JSON.parse(data) : [];
  }

  public getSchool(id: string): School | undefined {
    return this.getSchools().find(s => s.id === id);
  }

  public saveSchool(school: School): void {
    const list = this.getSchools();
    const idx = list.findIndex(s => s.id === school.id);
    if (idx >= 0) {
      list[idx] = school;
    } else {
      list.push(school);
    }
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(list));
  }

  // --- PARTNERS ---
  public getPartners(): Partner[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.PARTNERS);
    return data ? JSON.parse(data) : [];
  }

  public getPartner(id: string): Partner | undefined {
    return this.getPartners().find(p => p.id === id);
  }

  // --- STUDENTS ---
  public getStudents(schoolId?: string): Student[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const list: Student[] = data ? JSON.parse(data) : [];
    return schoolId ? list.filter(s => s.schoolId === schoolId) : list;
  }

  public getStudent(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  public saveStudent(student: Student): void {
    const list = this.getStudents();
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
  }

  // --- DAILY LOGS ---
  public getDailyLogs(schoolId?: string): DailyLog[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const list: DailyLog[] = data ? JSON.parse(data) : [];
    return schoolId ? list.filter(l => l.schoolId === schoolId) : list;
  }

  public getDailyLog(schoolId: string, dayNumber: number): DailyLog | undefined {
    return this.getDailyLogs(schoolId).find(l => l.dayNumber === dayNumber);
  }

  public saveDailyLog(log: DailyLog, actorName: string = 'Faculty'): void {
    const list = this.getDailyLogs();
    const idx = list.findIndex(l => l.id === log.id || (l.schoolId === log.schoolId && l.dayNumber === log.dayNumber));
    if (idx >= 0) {
      list[idx] = log;
    } else {
      list.push(log);
    }
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(list));

    // Recalculate school metrics
    const schoolLogs = list.filter(l => l.schoolId === log.schoolId && l.status !== 'Missing');
    const school = this.getSchool(log.schoolId);
    if (school) {
      if (log.dayNumber > school.currentDay) {
        school.currentDay = log.dayNumber;
        this.saveSchool(school);
      }
    }

    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole: 'faculty',
      action: 'DAILY_LOG_UPDATED',
      details: `Saved Day ${log.dayNumber} log for ${log.schoolId} (${log.hoursTaught} hrs taught).`,
      schoolId: log.schoolId
    });
  }

  // --- DRAFT DAILY LOG (for offline resilience) ---
  public getDraftDailyLog(): Partial<DailyLog> | null {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT_DAILY_LOG);
    return data ? JSON.parse(data) : null;
  }

  public saveDraftDailyLog(draft: Partial<DailyLog>): void {
    localStorage.setItem(STORAGE_KEYS.DRAFT_DAILY_LOG, JSON.stringify(draft));
  }

  public clearDraftDailyLog(): void {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DAILY_LOG);
  }

  // --- SOIL SAMPLES ---
  public getSoilSamples(schoolId?: string): SoilSample[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.SOIL_SAMPLES);
    const list: SoilSample[] = data ? JSON.parse(data) : [];
    return schoolId ? list.filter(s => s.schoolId === schoolId) : list;
  }

  public saveSoilSample(sample: SoilSample): void {
    const list = this.getSoilSamples();
    const idx = list.findIndex(s => s.id === sample.id);
    if (idx >= 0) {
      list[idx] = sample;
    } else {
      list.unshift(sample);
    }
    localStorage.setItem(STORAGE_KEYS.SOIL_SAMPLES, JSON.stringify(list));
  }

  // --- FARMER OUTREACH & CAMPAIGNS ---
  public getFarmerOutreach(schoolId?: string): FarmerOutreach[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.OUTREACH);
    const list: FarmerOutreach[] = data ? JSON.parse(data) : [];
    return schoolId ? list.filter(o => o.schoolId === schoolId) : list;
  }

  public saveFarmerOutreach(item: FarmerOutreach): void {
    const list = this.getFarmerOutreach();
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.OUTREACH, JSON.stringify(list));
  }

  public getCampaigns(schoolId?: string): Campaign[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    const list: Campaign[] = data ? JSON.parse(data) : [];
    return schoolId ? list.filter(c => c.schoolId === schoolId) : list;
  }

  public saveCampaign(item: Campaign): void {
    const list = this.getCampaigns();
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(list));
  }

  // --- BUDGET & INVENTORY ---
  public getBudgetLines(): BudgetLine[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return data ? JSON.parse(data) : [];
  }

  public saveBudgetLine(line: BudgetLine): void {
    const list = this.getBudgetLines();
    const idx = list.findIndex(b => b.id === line.id);
    if (idx >= 0) {
      list[idx] = line;
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(list));
    }
  }

  public getInventory(schoolId?: string): InventoryItem[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    const list: InventoryItem[] = data ? JSON.parse(data) : [];
    return schoolId ? list.filter(i => i.schoolId === schoolId) : list;
  }

  public saveInventory(item: InventoryItem): void {
    const list = this.getInventory();
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(list));
    }
  }

  // --- AUDIT & NOTIFICATIONS ---
  public getAuditLogs(): AuditLog[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [];
  }

  public addAuditLog(log: AuditLog): void {
    const list = this.getAuditLogs();
    list.unshift(log);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(list.slice(0, 100)));
  }

  public getNotifications(role?: Role): NotificationItem[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: NotificationItem[] = data ? JSON.parse(data) : [];
    return role ? list.filter(n => n.roleScope.includes(role)) : list;
  }

  public markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  }

  // --- TARGETS ---
  public getProgramTargets(): ProgramTargets {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return data ? JSON.parse(data) : DEFAULT_PROGRAM_TARGETS;
  }

  public saveProgramTargets(targets: ProgramTargets): void {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  }

  // --- STRICT ELIGIBILITY WORKFLOW ---
  public updateSchoolEligibilityCheck(schoolId: string, items: ChecklistItem[], evaluator: string): School {
    const school = this.getSchool(schoolId);
    if (!school) throw new Error(`School not found: ${schoolId}`);

    const total = items.length;
    const yesCount = items.filter(i => i.status === 'yes').length;
    const needsFixCount = items.filter(i => i.status === 'needs_fix').length;
    const noCount = items.filter(i => i.status === 'no').length;

    // Weight score: Yes = 100%, Needs Fix = 50%, No = 0%
    const score = Math.round(((yesCount * 1.0 + needsFixCount * 0.5) / total) * 100);

    let result: EligibilityResult = 'Eligible';
    const conditions: string[] = [];
    const rejections: string[] = [];

    if (noCount > 0 || score < 60) {
      result = 'Not_Eligible';
      items.filter(i => i.status === 'no').forEach(i => {
        rejections.push(`Critical requirement missing: ${i.label}. ${i.notes || ''}`);
      });
    } else if (needsFixCount > 0 || score < 85) {
      result = 'Eligible_With_Conditions';
      items.filter(i => i.status === 'needs_fix').forEach(i => {
        conditions.push(`Fix required: ${i.label} (Deadline: ${i.fixDeadline || 'Before Cohort Start'})`);
      });
    } else {
      result = 'Eligible';
    }

    school.eligibility = {
      score,
      result,
      evaluatedAt: new Date().toISOString(),
      evaluatedBy: evaluator,
      conditionsList: conditions,
      rejectionReasons: rejections,
      items
    };

    if (result === 'Not_Eligible') {
      school.status = 'Not_Eligible';
      school.healthStatus = 'critical';
    } else if (result === 'Eligible' && school.status === 'Eligibility_Check') {
      school.status = 'Approved';
      school.healthStatus = 'healthy';
    } else if (result === 'Eligible_With_Conditions') {
      school.healthStatus = 'attention';
    }

    this.saveSchool(school);

    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: evaluator,
      actorRole: 'partner',
      action: 'ELIGIBILITY_EVALUATION',
      details: `Evaluated ${school.name}: Score ${score}%, Result: ${result}`,
      schoolId: school.id
    });

    return school;
  }

  public enrollSchool(schoolId: string, actorName: string = 'Arkashine Admin'): { success: boolean; message: string } {
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

    // Advance pipeline
    if (school.status === 'Approved' || school.status === 'Lab_Setup') {
      school.status = 'Enrolled';
    } else if (school.status === 'Enrolled') {
      school.status = 'Running';
      school.currentDay = 1;
      // Generate cohort if not exists
      if (this.getStudents(schoolId).length === 0) {
        const students = generateStudentsForSchool(schoolId, 18);
        const existing = this.getStudents();
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([...existing, ...students]));
      }
      // Generate day logs if not exists
      if (this.getDailyLogs(schoolId).length === 0) {
        const logs = generateDailyLogsForSchool(school, 28);
        const existingLogs = this.getDailyLogs();
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify([...existingLogs, ...logs]));
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

  // --- STRICT CERTIFICATE GATING ---
  public issueCertificate(studentId: string, actorName: string = 'Arkashine Super Admin'): { success: boolean; message: string; student?: Student } {
    const student = this.getStudent(studentId);
    if (!student) return { success: false, message: 'Student record not found' };

    const targets = this.getProgramTargets();
    const missing: string[] = [];

    if (student.attendanceRate < targets.attendanceThreshold) {
      missing.push(`Attendance rate of ${student.attendanceRate}% is below the required ${targets.attendanceThreshold}%`);
    }
    if (student.modulesCompleted < 4) {
      missing.push(`Has completed only ${student.modulesCompleted}/4 curriculum modules`);
    }
    if (student.practicalsDone < 6) {
      missing.push(`Has completed only ${student.practicalsDone}/6 mandatory SoiLENZ laboratory practicals`);
    }
    if (!student.capstoneSubmitted) {
      missing.push('Capstone soil health presentation has not been submitted or approved');
    }

    if (missing.length > 0) {
      student.certificateStatus = 'Incomplete_Data';
      student.missingFields = missing;
      this.saveStudent(student);
      return { 
        success: false, 
        message: `Certificate blocked due to incomplete requirements:\n• ${missing.join('\n• ')}` 
      };
    }

    student.certificateStatus = 'Issued';
    student.certificateId = `CERT-${student.schoolId}-${student.rollNo.replace('SIL-2026-', '')}`;
    student.verifiedQrHash = `ark-sil-${student.schoolId.toLowerCase()}-${student.rollNo.replace('SIL-2026-', '')}`;
    if (!student.badgeIds.includes('badge-ambassador')) {
      student.badgeIds.push('badge-ambassador');
    }

    this.saveStudent(student);
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole: 'arkashine',
      action: 'CERTIFICATE_ISSUED',
      details: `Issued Soil Partner Certificate ${student.certificateId} for ${student.name} (${student.rollNo})`,
      schoolId: student.schoolId
    });

    return { 
      success: true, 
      message: `Certificate ${student.certificateId} successfully issued for ${student.name}!`,
      student 
    };
  }

  public bulkIssueEligibleCertificates(schoolId: string, actorName: string = 'Arkashine Super Admin'): { count: number; message: string } {
    const students = this.getStudents(schoolId);
    let count = 0;

    for (const stu of students) {
      if (stu.certificateStatus === 'Eligible') {
        const res = this.issueCertificate(stu.id, actorName);
        if (res.success) count++;
      }
    }

    return {
      count,
      message: `Successfully issued certificates for ${count} eligible students.`
    };
  }
}

export const storageService = new StorageService();
