import { Partner, ProgramTargets } from '../../types';

export const DEFAULT_PROGRAM_TARGETS: ProgramTargets = {
  totalHours: 72,
  weeklyHours: 18,
  attendanceThreshold: 80,
  targetFarmersPerSchool: 1500,
  targetSamplesPerSchool: 750,
  targetCampaignsPerSchool: 30,
  budgetCeiling: 500000,
  studentsPerSchool: 18,
  groupsPerSchool: 5
};

export const SEED_PARTNERS: Partner[] = [
  {
    id: 'PARTNER-01',
    name: 'GreenHorizon AgriEd Foundation',
    contactPerson: 'Dr. Sunita Deshmukh',
    email: 'sunita.deshmukh@greenhorizon.org',
    phone: '+91 98230 44521',
    region: 'Western & Central Zone (Maharashtra, MP, Haryana)',
    schoolsAssigned: ['SCH-01', 'SCH-03', 'SCH-04'],
    activeCohorts: 2,
    complianceRate: 94.2
  },
  {
    id: 'PARTNER-02',
    name: 'Sahyadri Rural Development Trust',
    contactPerson: 'Rajesh K. Varma',
    email: 'rajesh.varma@sahyadritrust.in',
    phone: '+91 94220 88192',
    region: 'Gujarat, Rajasthan & Southern Zone (Telangana)',
    schoolsAssigned: ['SCH-02', 'SCH-05', 'SCH-06'],
    activeCohorts: 1,
    complianceRate: 86.8
  }
];
