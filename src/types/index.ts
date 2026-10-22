export type Role = 'arkashine' | 'partner' | 'principal' | 'faculty' | 'student';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
  partnerId?: string;
  studentId?: string;
  avatar?: string;
  phone?: string;
  title?: string;
}

export type SchoolStatus = 
  | 'Identified' 
  | 'Eligibility_Check' 
  | 'Approved' 
  | 'Lab_Setup' 
  | 'Enrolled' 
  | 'Running' 
  | 'Completed' 
  | 'Not_Eligible';

export type EligibilityResult = 'Eligible' | 'Eligible_With_Conditions' | 'Not_Eligible' | 'Pending';

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'Space' | 'Infrastructure' | 'Safety' | 'People' | 'Students' | 'Agreement';
  status: 'yes' | 'no' | 'needs_fix';
  notes?: string;
  proofDocumentUrl?: string;
  fixDeadline?: string;
}

export interface EligibilityDetails {
  score: number; // 0-100
  result: EligibilityResult;
  evaluatedAt?: string;
  evaluatedBy?: string;
  conditionsList: string[];
  rejectionReasons: string[];
  items: ChecklistItem[];
}

export interface School {
  id: string;
  code: string;
  name: string;
  partnerId: string;
  principalName: string;
  principalEmail: string;
  principalPhone: string;
  facultyName: string;
  facultyPhone: string;
  city: string;
  state: string;
  pinCode: string;
  status: SchoolStatus;
  eligibility: EligibilityDetails;
  coordinates: { lat: number; lng: number };
  currentDay: number; // 1-28
  totalStudentsSelected: number;
  healthStatus: 'healthy' | 'attention' | 'critical';
  bannerImage?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  schoolsAssigned: string[]; // school IDs
  activeCohorts: number;
  complianceRate: number;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  rollNo: string;
  gender: 'Female' | 'Male' | 'Other';
  classGrade: 'VIII' | 'IX' | 'X' | 'XI' | 'XII';
  groupNumber: number; // 1 to 5
  avatar: string;
  selectionStage: 'Registered' | 'Quiz_Hackathon' | 'Assignment' | 'Selected';
  quizScore: number; // out of 100
  assignmentScore: number; // out of 100
  attendanceRate: number; // 0-100%
  totalPresentDays: number;
  totalLoggedDays: number;
  modulesCompleted: number; // 0 to 4
  practicalsDone: number; // target e.g. 8
  outreachFarmersCount: number;
  soilSamplesTestedCount: number;
  capstoneSubmitted: boolean;
  certificateStatus: 'Eligible' | 'Incomplete_Data' | 'Issued' | 'Not_Eligible';
  missingFields: string[];
  badgeIds: string[];
  certificateId?: string;
  verifiedQrHash?: string;
}

export type SessionType = 'Theory' | 'Practical' | 'Field' | 'Assessment';
export type DailyLogStatus = 'On_Time' | 'Late' | 'Partial' | 'Missing';

export interface DailyLog {
  id: string;
  schoolId: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 28
  facultyId: string;
  facultyName: string;
  moduleNumber: number; // 1 to 4
  moduleTitle: string;
  topicsCovered: string[];
  learningDescription?: string;
  sessionType: SessionType;
  hoursTaught: number; // e.g. 2.5
  plannedHours: number; // usually 2.5 or 3.0
  isDelayed: boolean;
  delayReason?: string;
  status: DailyLogStatus;
  studentAttendance: Record<string, 'present' | 'absent' | 'late'>;
  samplesTestedCount: number;
  farmersReachedCount: number;
  campaignsCount: number;
  stockUsed: string;
  incidentNotes?: string;
  photos: string[];
  principalRemarks?: string;
  partnerRemarks?: string;
  isLocked: boolean;
  submittedAt?: string;
}

export interface SoilParameters {
  pH: number;
  ec: number; // electrical conductivity dS/m
  organicCarbon: number; // %
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  moisture: number; // %
  micronutrients?: {
    zinc: number; // ppm
    iron: number; // ppm
    sulfur: number; // ppm
    boron: number; // ppm
  };
}

export interface SoilSample {
  id: string;
  sampleCode: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  groupNumber: number;
  date: string;
  village: string;
  farmerName: string;
  farmerPhone: string;
  cropType: string;
  parameters: SoilParameters;
  healthScore: number; // 0 to 100
  healthCategory: 'Excellent' | 'Good' | 'Moderate' | 'Degraded';
  reportStatus: 'Generated' | 'Delivered' | 'Pending';
  soiLenzDeviceId: string;
}

export interface FarmerOutreach {
  id: string;
  schoolId: string;
  date: string;
  groupNumber: number;
  studentNames: string[];
  village: string;
  farmerName: string;
  phone: string;
  landAreaHectares: number;
  primaryCrop: string;
  soilSampleCode?: string;
  adviceGiven: string;
  status: 'Completed' | 'Follow_Up';
}

export interface Campaign {
  id: string;
  schoolId: string;
  date: string;
  title: string;
  village: string;
  attendeesCount: number;
  topicsCovered: string;
  groupNumber: number;
  photos: string[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  principalName: string;
  issueDate: string;
  qrVerificationUrl: string;
  verificationHash: string;
  status: 'Draft' | 'Faculty_Confirmed' | 'Partner_Reviewed' | 'Principal_Approved' | 'Arkashine_Issued';
  complianceScore: number;
  attendancePct: number;
  hoursCompleted: number;
}

export interface BudgetLine {
  id: string;
  code: string;
  category: string;
  description: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  status: 'Within_Budget' | 'Near_Limit' | 'Exceeded';
  notes?: string;
}

export interface InventoryItem {
  id: string;
  schoolId: string;
  itemName: string;
  category: 'Device' | 'Reagent' | 'Sampling_Kit' | 'Safety' | 'Stationery';
  totalQuantity: number;
  usedQuantity: number;
  unit: string;
  reorderLevel: number;
  status: 'Adequate' | 'Low' | 'Critical';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  action: string;
  details: string;
  schoolId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
  roleScope: Role[];
  schoolId?: string;
}

export interface ProgramTargets {
  totalHours: number; // default 72
  weeklyHours: number; // default 18
  attendanceThreshold: number; // default 80%
  targetFarmersPerSchool: number; // default 1500
  targetSamplesPerSchool: number; // default 750
  targetCampaignsPerSchool: number; // default 30
  budgetCeiling: number; // default 500000
  studentsPerSchool: number; // default 18
  groupsPerSchool: number; // default 5
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'sampling' | 'testing' | 'reporting' | 'outreach' | 'leadership';
  unlockedAt?: string;
}
