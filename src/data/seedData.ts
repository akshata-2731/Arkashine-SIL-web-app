import { 
  School, Partner, Student, DailyLog, SoilSample, 
  FarmerOutreach, Campaign, Certificate, InventoryItem, 
  AuditLog, NotificationItem, ProgramTargets, ChecklistItem
} from '../types';

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

const createInitialChecklist = (schoolCode: string): ChecklistItem[] => {
  const isPending = schoolCode === 'SCH-05';
  const isRejected = schoolCode === 'SCH-06';

  return [
    {
      id: `${schoolCode}-chk-1`,
      category: 'Space',
      label: 'Dedicated Classroom or Lab Corner for Soil Innovation Lab',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'No dedicated space; proposed sharing with regular physics lab during peak hours' : '280 sq ft dedicated science room corner allocated on 1st floor',
      proofDocumentUrl: '/docs/lab-layout-approval.pdf'
    },
    {
      id: `${schoolCode}-chk-2`,
      category: 'Space',
      label: 'Student Work Area & Assembly Benches (minimum 20 capacity)',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'Bench capacity limited to 8 students' : 'Modular work tables configured for 5 teams of 4'
    },
    {
      id: `${schoolCode}-chk-3`,
      category: 'Space',
      label: 'SoiLENZ Digital Device Testing & Calibration Station',
      status: isRejected ? 'no' : 'yes',
      notes: 'Anti-vibration table with stable electrical sockets installed'
    },
    {
      id: `${schoolCode}-chk-4`,
      category: 'Space',
      label: 'Sample Preparation, Drying & Sieve Zone',
      status: isRejected ? 'no' : 'yes',
      notes: 'Ventilated drying shelf with 2mm sieve stand'
    },
    {
      id: `${schoolCode}-chk-5`,
      category: 'Space',
      label: 'Air-tight Specimen Storage Cabinet for 500+ Samples',
      status: 'yes',
      notes: 'Lockable steel cabinet with barcode labeling compartments'
    },
    {
      id: `${schoolCode}-chk-6`,
      category: 'Infrastructure',
      label: 'Uninterrupted 220V Electricity Supply with Power Backup',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'Frequent voltage spikes; no UPS in proposed wing' : 'Connected to school solar-hybrid inverter system'
    },
    {
      id: `${schoolCode}-chk-7`,
      category: 'Infrastructure',
      label: 'High-speed Internet / Wi-Fi for Cloud Data Telemetry',
      status: isPending ? 'needs_fix' : 'yes',
      notes: isPending ? 'Wi-Fi repeater needed to cover rear lab wing' : '50 Mbps broadband verified during site inspection',
      fixDeadline: isPending ? '2026-10-25' : undefined
    },
    {
      id: `${schoolCode}-chk-8`,
      category: 'Infrastructure',
      label: 'Adequate Natural Ventilation & Exhaust System',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'Basement room with single small window; high dampness' : 'Dual cross-ventilation windows and overhead exhaust fan'
    },
    {
      id: `${schoolCode}-chk-9`,
      category: 'Infrastructure',
      label: 'Digital Projector or Smart Display Screen for Theory Sessions',
      status: 'yes',
      notes: '55-inch interactive digital display panel operational'
    },
    {
      id: `${schoolCode}-chk-10`,
      category: 'Safety',
      label: 'Personal Protective Equipment (Nitrile Gloves, Splash Eyewear, Lab Coats)',
      status: isPending ? 'needs_fix' : 'yes',
      notes: isPending ? 'Eye protection goggles short by 10 units; ordered' : 'Full set of 25 pairs stored in safety bin',
      fixDeadline: isPending ? '2026-10-24' : undefined
    },
    {
      id: `${schoolCode}-chk-11`,
      category: 'Safety',
      label: 'Certified First-Aid Kit & Emergency Eyewash Bottle Station',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'No first-aid or eyewash present' : 'Inspected and certified by school medical officer'
    },
    {
      id: `${schoolCode}-chk-12`,
      category: 'Safety',
      label: 'Safe Chemical Reagent Storage with Spill Containment Tray',
      status: 'yes',
      notes: 'Chemical cabinet with secondary containment tray installed'
    },
    {
      id: `${schoolCode}-chk-13`,
      category: 'People',
      label: 'Named Faculty Coordinator with Science/Agri Background Committed for 72h',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'No permanent teacher assigned; proposed rotating temporary staff' : 'Senior Chemistry / Biology teacher nominated with 100% summer commitment'
    },
    {
      id: `${schoolCode}-chk-14`,
      category: 'People',
      label: '3 to 5 School Innovation Committee Members Appointed',
      status: 'yes',
      notes: 'Principal, Science Head, PTA Representative, and local Agronomist'
    },
    {
      id: `${schoolCode}-chk-15`,
      category: 'People',
      label: 'Principal Written Consent & Program Endorsement Letter',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'Principal withheld formal letter pending board approval' : 'Signed letter on school letterhead uploaded'
    },
    {
      id: `${schoolCode}-chk-16`,
      category: 'Students',
      label: 'Pre-registration Funnel of 80 to 150 Interested Students (Classes VIII-XII)',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'Only 24 registrations collected due to conflicting exams' : '118 students registered for Innovation Quiz screening'
    },
    {
      id: `${schoolCode}-chk-17`,
      category: 'Agreement',
      label: 'Formally Signed Tripartite MoU Uploaded',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'MoU unsigned due to dispute over electricity expense' : 'MoU executed with Arkashine & Partner'
    },
    {
      id: `${schoolCode}-chk-18`,
      category: 'Agreement',
      label: 'Partner Comprehensive Site-Visit Verification Report Uploaded',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'Site visit highlighted serious structural safety and ventilation hazards' : 'Site visit scored 94/100 by GreenHorizon field engineer'
    }
  ];
};

export const SEED_SCHOOLS: School[] = [
  {
    id: 'SCH-01',
    code: 'STX-BAR',
    name: "St. Xavier's Model Senior Secondary School",
    partnerId: 'PARTNER-01',
    principalName: 'Fr. Thomas Matthew',
    principalEmail: 'principal@stxaviersbaramati.edu.in',
    principalPhone: '+91 98221 00312',
    facultyName: 'Dr. Anjali Patil (M.Sc. Chemistry)',
    facultyPhone: '+91 98901 22345',
    city: 'Baramati',
    state: 'Maharashtra',
    pinCode: '413102',
    status: 'Running',
    healthStatus: 'healthy',
    currentDay: 20,
    totalStudentsSelected: 18,
    coordinates: { lat: 18.1517, lng: 74.5770 },
    bannerImage: '/assets/images/hero-banner.png',
    createdAt: '2026-05-10',
    eligibility: {
      score: 96,
      result: 'Eligible',
      evaluatedAt: '2026-05-15',
      evaluatedBy: 'Dr. Sunita Deshmukh',
      conditionsList: [],
      rejectionReasons: [],
      items: createInitialChecklist('SCH-01')
    }
  },
  {
    id: 'SCH-02',
    code: 'VKV-AND',
    name: 'Vidyasagar Krishi Vidyapeeth',
    partnerId: 'PARTNER-02',
    principalName: 'Dr. Bhavesh Bhatt',
    principalEmail: 'bhatt.b@vidyasagar-anand.edu.in',
    principalPhone: '+91 98795 33411',
    facultyName: 'Prof. Ramesh Solanki (M.Sc. Botany)',
    facultyPhone: '+91 98251 66782',
    city: 'Anand',
    state: 'Gujarat',
    pinCode: '388001',
    status: 'Running',
    healthStatus: 'attention',
    currentDay: 21,
    totalStudentsSelected: 19,
    coordinates: { lat: 22.5645, lng: 72.9289 },
    bannerImage: '/assets/images/module-soil-testing.png',
    createdAt: '2026-05-12',
    eligibility: {
      score: 91,
      result: 'Eligible',
      evaluatedAt: '2026-05-16',
      evaluatedBy: 'Rajesh K. Varma',
      conditionsList: [],
      rejectionReasons: [],
      items: createInitialChecklist('SCH-02')
    }
  },
  {
    id: 'SCH-03',
    code: 'KV1-HSH',
    name: 'Kendriya Vidyalaya No. 1 Narmadapuram',
    partnerId: 'PARTNER-01',
    principalName: 'Smt. Kamla Srivastav',
    principalEmail: 'principal.kv1hoshangabad@gov.in',
    principalPhone: '+91 94250 11984',
    facultyName: 'Shri Vikram Sharma (PGT Biology)',
    facultyPhone: '+91 94065 44321',
    city: 'Hoshangabad',
    state: 'Madhya Pradesh',
    pinCode: '461001',
    status: 'Running',
    healthStatus: 'healthy',
    currentDay: 19,
    totalStudentsSelected: 17,
    coordinates: { lat: 22.7519, lng: 77.7289 },
    bannerImage: '/assets/images/module-sample-collection.png',
    createdAt: '2026-05-14',
    eligibility: {
      score: 93,
      result: 'Eligible',
      evaluatedAt: '2026-05-18',
      evaluatedBy: 'Dr. Sunita Deshmukh',
      conditionsList: [],
      rejectionReasons: [],
      items: createInitialChecklist('SCH-03')
    }
  },
  {
    id: 'SCH-04',
    code: 'PPS-KRL',
    name: 'Pragati Public Senior Secondary School',
    partnerId: 'PARTNER-01',
    principalName: 'Capt. Harinder Singh',
    principalEmail: 'hsingh@pragatipublickarnal.org',
    principalPhone: '+91 98120 77412',
    facultyName: 'Deepa Mann (M.Sc. Agriculture)',
    facultyPhone: '+91 98960 99812',
    city: 'Karnal',
    state: 'Haryana',
    pinCode: '132001',
    status: 'Lab_Setup',
    healthStatus: 'healthy',
    currentDay: 0,
    totalStudentsSelected: 18,
    coordinates: { lat: 29.6857, lng: 76.9905 },
    bannerImage: '/assets/images/student-lab-discovery.png',
    createdAt: '2026-05-20',
    eligibility: {
      score: 92,
      result: 'Eligible',
      evaluatedAt: '2026-05-25',
      evaluatedBy: 'Dr. Sunita Deshmukh',
      conditionsList: ['Complete calibration of SoiLENZ sensors before June 1'],
      rejectionReasons: [],
      items: createInitialChecklist('SCH-04')
    }
  },
  {
    id: 'SCH-05',
    code: 'NAG-WRG',
    name: 'Navodaya Adarsh Gurukulam',
    partnerId: 'PARTNER-02',
    principalName: 'Dr. K. Srinivas Rao',
    principalEmail: 'srinivas.rao@gurukulamwarangal.org',
    principalPhone: '+91 94401 22849',
    facultyName: 'Sujatha Reddy (TGT Science)',
    facultyPhone: '+91 94418 33201',
    city: 'Warangal',
    state: 'Telangana',
    pinCode: '506002',
    status: 'Eligibility_Check',
    healthStatus: 'attention',
    currentDay: 0,
    totalStudentsSelected: 0,
    coordinates: { lat: 17.9689, lng: 79.5941 },
    bannerImage: '/assets/images/eligibility-check.png',
    createdAt: '2026-05-28',
    eligibility: {
      score: 74,
      result: 'Eligible_With_Conditions',
      evaluatedAt: '2026-06-01',
      evaluatedBy: 'Rajesh K. Varma',
      conditionsList: [
        'Install Wi-Fi mesh repeater to guarantee >20Mbps coverage in testing room (by Oct 25)',
        'Procure 10 additional pairs of safety splash goggles (by Oct 24)'
      ],
      rejectionReasons: [],
      items: createInitialChecklist('SCH-05')
    }
  },
  {
    id: 'SCH-06',
    code: 'MAH-ALW',
    name: 'Modern Academy High School',
    partnerId: 'PARTNER-02',
    principalName: 'Mahesh C. Gupta',
    principalEmail: 'gupta.mc@modernacademyalwar.in',
    principalPhone: '+91 94140 55102',
    facultyName: 'Not Assigned',
    facultyPhone: 'N/A',
    city: 'Alwar',
    state: 'Rajasthan',
    pinCode: '301001',
    status: 'Not_Eligible',
    healthStatus: 'critical',
    currentDay: 0,
    totalStudentsSelected: 0,
    coordinates: { lat: 27.5530, lng: 76.6346 },
    bannerImage: '/assets/images/empty-state.png',
    createdAt: '2026-06-02',
    eligibility: {
      score: 41,
      result: 'Not_Eligible',
      evaluatedAt: '2026-06-05',
      evaluatedBy: 'Rajesh K. Varma',
      conditionsList: [],
      rejectionReasons: [
        'No dedicated laboratory space allocated; shared room poses high contamination risk.',
        'No named permanent Faculty Coordinator committed to 72 hours of summer instruction.',
        'Basement facility lacks mandatory cross-ventilation and exhaust system.',
        'Unresolved power surge issues without inverter backup jeopardize electronic sensor accuracy.',
        'School management declined to sign standard tripartite MoU.'
      ],
      items: createInitialChecklist('SCH-06')
    }
  }
];

// Student cohort generation helper
const FIRST_NAMES_FEMALE = ['Ananya', 'Priya', 'Sneha', 'Diya', 'Kavya', 'Tanvi', 'Meera', 'Pooja', 'Ritu', 'Isha', 'Bhavna', 'Shreya'];
const FIRST_NAMES_MALE = ['Aarav', 'Rohan', 'Vikram', 'Aditya', 'Ishaan', 'Arjun', 'Rahul', 'Dev', 'Nihal', 'Sameer', 'Karan', 'Manish'];
const LAST_NAMES = ['Sharma', 'Patil', 'Deshmukh', 'Verma', 'Singh', 'Jadhav', 'Bhatt', 'Rao', 'Kulkarni', 'Chauhan', 'Mehta', 'Nair'];

export function generateStudentsForSchool(schoolId: string, count: number = 18): Student[] {
  const students: Student[] = [];
  const grades: ('VIII' | 'IX' | 'X' | 'XI' | 'XII')[] = ['VIII', 'IX', 'X', 'XI', 'XII'];

  for (let i = 0; i < count; i++) {
    const isFemale = i % 2 === 0;
    const firstName = isFemale 
      ? FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length] 
      : FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length];
    const lastName = LAST_NAMES[(i * 3 + (schoolId.charCodeAt(schoolId.length - 1))) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const groupNumber = (i % 5) + 1;
    const classGrade = grades[i % grades.length];

    // Believable realistic metrics
    // A couple of students have incomplete data or lower attendance to test gating
    const isAtRisk = (schoolId === 'SCH-02' && (i === 4 || i === 9)) || (schoolId === 'SCH-01' && i === 15);
    const attendanceRate = isAtRisk ? (68 + (i % 9)) : (84 + (i % 15));
    const totalLogged = 20;
    const presentDays = Math.round((attendanceRate / 100) * totalLogged);

    const modulesCompleted = isAtRisk ? 2 : (i % 5 === 0 ? 4 : 3);
    const practicalsDone = isAtRisk ? 4 : Math.min(8, 6 + (i % 3));
    const soilSamplesTestedCount = 12 + (i * 2);
    const outreachFarmersCount = 28 + (i * 4);
    const capstoneSubmitted = !isAtRisk && (i < 12);

    // Gating check for certificate
    let certStatus: 'Eligible' | 'Incomplete_Data' | 'Issued' | 'Not_Eligible' = 'Incomplete_Data';
    const missing: string[] = [];

    if (attendanceRate < 80) {
      missing.push(`Attendance at ${attendanceRate}% is below 80% threshold`);
    }
    if (modulesCompleted < 4) {
      missing.push(`Module 4 assessment pending (currently at Module ${modulesCompleted})`);
    }
    if (practicalsDone < 6) {
      missing.push(`Completed only ${practicalsDone}/6 mandatory laboratory practicals`);
    }
    if (!capstoneSubmitted) {
      missing.push('Final Soil Health Capstone presentation not uploaded');
    }

    if (missing.length === 0) {
      certStatus = i < 6 ? 'Issued' : 'Eligible';
    } else if (attendanceRate < 70) {
      certStatus = 'Not_Eligible';
    } else {
      certStatus = 'Incomplete_Data';
    }

    const badgeIds: string[] = ['badge-sampler'];
    if (soilSamplesTestedCount >= 20) badgeIds.push('badge-tester');
    if (outreachFarmersCount >= 50) badgeIds.push('badge-farmer-friend');
    if (capstoneSubmitted) badgeIds.push('badge-reporter');
    if (certStatus === 'Issued') badgeIds.push('badge-ambassador');

    students.push({
      id: `${schoolId}-STU-${String(i + 1).padStart(2, '0')}`,
      schoolId,
      name: fullName,
      rollNo: `SIL-2026-${String(i + 101)}`,
      gender: isFemale ? 'Female' : 'Male',
      classGrade,
      groupNumber,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName}`,
      selectionStage: 'Selected',
      quizScore: 78 + (i % 21),
      assignmentScore: 82 + (i % 17),
      attendanceRate,
      totalPresentDays: presentDays,
      totalLoggedDays: totalLogged,
      modulesCompleted,
      practicalsDone,
      outreachFarmersCount,
      soilSamplesTestedCount,
      capstoneSubmitted,
      certificateStatus: certStatus,
      missingFields: missing,
      badgeIds,
      certificateId: certStatus === 'Issued' ? `CERT-${schoolId}-${String(i + 1).padStart(2, '0')}` : undefined,
      verifiedQrHash: certStatus === 'Issued' ? `ark-sil-${schoolId.toLowerCase()}-${i + 101}` : undefined
    });
  }

  return students;
}

export function generateDailyLogsForSchool(school: School, totalDays: number = 28): DailyLog[] {
  const logs: DailyLog[] = [];
  const currentWorkingDay = school.currentDay;

  // Curated topics across 28 days
  const topicMaster = [
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Soil Composition, Texture Ribbon Test & Soil Horizons' },
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Soil Physics: Bulk Density, Porosity & Water Retention' },
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Soil Chemistry: pH Scale, Salinity & Buffer Capacity' },
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Electrical Conductivity (EC) Measurement Fundamentals' },
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Primary Macro Nutrients: Nitrogen, Phosphorus, Potassium' },
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Secondary Nutrients (Ca, Mg, S) & Trace Micronutrients' },
    { mod: 1, title: 'Introduction to Agriculture & Soil Science', topic: 'Soil Biology, Humus & Carbon Sequestration Principles' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Field Topography & Demarcating Homogeneous Land Parcels' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Zig-zag Traversal & Spatial Grid Sampling Design' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Operating Stainless Steel Core Auger at 0-15cm Depth' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Geotagging Samples & Mobile GPS Coordinate Logging' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Composite Mixing & The Circular Quartering Reduction Technique' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Shade Air-Drying Trays & Preventing Ammonia Loss' },
    { mod: 2, title: 'Soil Sample Collection & Preparation', topic: 'Pestle Crushing & 2mm Stainless Sieve Screening' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'SoiLENZ Handheld Device Anatomy & Optical Sensor Care' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'Two-Point Calibration with Standard pH 4.0 & 7.0 Buffers' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'Zero-Standard White Reference Optical Calibration' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'Rapid Extractant Chemistry & 90-Second Telemetric Scan' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'Handling Sensor Drift & Triplicate Verification Protocol' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'Cross-validating Optical Readings with Colorimetric Tests' },
    { mod: 3, title: 'Soil Testing using SoiLENZ Device', topic: 'Outlier Rejection Algorithms & Telemetry Synchronization' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Anatomy of the Arkashine Soil Health Card Matrix' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Diagnostic Benchmarks: Low, Medium, High Thresholds' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Formulating Customized Fertilizer Recommendations (CFR)' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Balancing Chemical NPK with Farm Yard Manure (FYM)' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Farmer Advisory Role-Playing & Vernacular Dialogue' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Village Community Campaign Organization & Field Demo' },
    { mod: 4, title: 'Understanding Soil Health Reports & Advisory', topic: 'Final Soil Innovation Capstone Presentations & Convocation' }
  ];

  for (let d = 1; d <= totalDays; d++) {
    // Generate dates: 4 weeks program starting June 1, 2026 (Mon-Sat)
    const baseDate = new Date(2026, 5, 1);
    const dateOffset = Math.floor((d - 1) * 1.25);
    const logDate = new Date(baseDate.getTime() + dateOffset * 86400000);
    const dateStr = logDate.toISOString().split('T')[0];

    const topicEntry = topicMaster[d - 1];

    if (d > currentWorkingDay) {
      // Future day
      logs.push({
        id: `LOG-${school.id}-DAY-${String(d).padStart(2, '0')}`,
        schoolId: school.id,
        date: dateStr,
        dayNumber: d,
        facultyId: `FAC-${school.id}`,
        facultyName: school.facultyName,
        moduleNumber: topicEntry.mod,
        moduleTitle: topicEntry.title,
        topicsCovered: [topicEntry.topic],
        sessionType: d % 3 === 0 ? 'Field' : (d % 2 === 0 ? 'Practical' : 'Theory'),
        hoursTaught: 0,
        plannedHours: 2.5,
        isDelayed: false,
        status: 'Missing',
        studentAttendance: {},
        samplesTestedCount: 0,
        farmersReachedCount: 0,
        campaignsCount: 0,
        stockUsed: 'None',
        photos: [],
        isLocked: false
      });
      continue;
    }

    // Past or current day
    let status: 'On_Time' | 'Late' | 'Partial' | 'Missing' = 'On_Time';
    let hoursTaught = 2.5;

    // Introduce realistic variance
    if (school.code === 'VKV-AND' && (d === 12 || d === 13)) {
      status = 'Missing';
      hoursTaught = 0;
    } else if (school.code === 'VKV-AND' && d === 14) {
      status = 'Partial';
      hoursTaught = 1.5;
    } else if (d === 7 || d === 15) {
      status = 'Late';
      hoursTaught = 2.5;
    } else if (d === 11 && school.code === 'KV1-HSH') {
      status = 'Partial';
      hoursTaught = 1.0;
    }

    const sessionType: 'Theory' | 'Practical' | 'Field' | 'Assessment' = 
      d === 7 || d === 14 || d === 21 || d === 28 
        ? 'Assessment' 
        : (d % 3 === 0 ? 'Field' : (d % 2 === 0 ? 'Practical' : 'Theory'));

    const samplesTested = status === 'Missing' ? 0 : (sessionType === 'Practical' ? 14 : (sessionType === 'Field' ? 8 : 4));
    const farmersReached = status === 'Missing' ? 0 : (sessionType === 'Field' ? 42 : (sessionType === 'Practical' ? 15 : 8));
    const campaigns = sessionType === 'Field' && d % 4 === 0 ? 1 : 0;

    // Student attendance map
    const studentAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    for (let s = 1; s <= 18; s++) {
      const stuId = `${school.id}-STU-${String(s).padStart(2, '0')}`;
      if (status === 'Missing') {
        studentAttendance[stuId] = 'absent';
      } else {
        const rand = (d * 17 + s * 13) % 100;
        studentAttendance[stuId] = rand < 88 ? 'present' : (rand < 95 ? 'late' : 'absent');
      }
    }

    logs.push({
      id: `LOG-${school.id}-DAY-${String(d).padStart(2, '0')}`,
      schoolId: school.id,
      date: dateStr,
      dayNumber: d,
      facultyId: `FAC-${school.id}`,
      facultyName: school.facultyName,
      moduleNumber: topicEntry.mod,
      moduleTitle: topicEntry.title,
      topicsCovered: [topicEntry.topic],
      sessionType,
      hoursTaught,
      plannedHours: 2.5,
      isDelayed: status === 'Late' || status === 'Partial',
      delayReason: status === 'Late' 
        ? 'Power backup inverter switchover delayed afternoon practical session by 45 minutes.'
        : (status === 'Missing' ? 'Local heavy rain flooded access road to village demo plots.' : undefined),
      status,
      studentAttendance,
      samplesTestedCount: samplesTested,
      farmersReachedCount: farmersReached,
      campaignsCount: campaigns,
      stockUsed: status === 'Missing' ? 'None' : `${Math.floor(samplesTested * 1.5)} filter papers, 120ml standard extractant, 20 nitrile gloves`,
      incidentNotes: status === 'Missing' ? 'Session postponed to weekend compensatory slot.' : 'Session executed safely without equipment malfunction.',
      photos: status !== 'Missing' ? [
        '/assets/images/module-soil-testing.png',
        '/assets/images/module-sample-collection.png'
      ] : [],
      principalRemarks: d % 5 === 0 ? 'Verified during routine lab round. Good student discipline and note-keeping.' : undefined,
      partnerRemarks: d === 14 ? 'Followed up with faculty regarding mid-program attendance dip. Compensatory classes scheduled.' : undefined,
      isLocked: d < currentWorkingDay - 2,
      submittedAt: status !== 'Missing' ? `${dateStr}T17:45:00Z` : undefined
    });
  }

  return logs;
}

export function generateSoilSamples(): SoilSample[] {
  const samples: SoilSample[] = [];
  const villages = ['Baramati Rural', 'Malegaon Budruk', 'Kalyanpur', 'Kashti', 'Anand Agri Block', 'Borsad Village', 'Tarapur', 'Narmada Valley Plot', 'Rasulia Farm', 'Babai Sector'];
  const farmers = ['Babanrao Shinde', 'Ganesh Kadam', 'Suresh Patel', 'Pravin Solanki', 'Mohanlal Yadav', 'Harishchand Meena', 'Devendra Singh', 'Rameshwar Lodhi', 'Jagdish Dabhi', 'Nandkishore Gour'];
  const crops = ['Sugarcane', 'Cotton', 'Paddy (Rice)', 'Wheat', 'Soybean', 'Groundnut', 'Maize', 'Tur / Pigeon Pea', 'Banana', 'Gram / Chickpea'];

  let count = 0;
  for (const schoolId of ['SCH-01', 'SCH-02', 'SCH-03']) {
    const totalSamplesForSchool = schoolId === 'SCH-01' ? 96 : (schoolId === 'SCH-02' ? 84 : 76);
    
    for (let i = 1; i <= totalSamplesForSchool; i++) {
      count++;
      const stuIndex = ((i - 1) % 18) + 1;
      const stuId = `${schoolId}-STU-${String(stuIndex).padStart(2, '0')}`;
      const groupNum = ((stuIndex - 1) % 5) + 1;
      const village = villages[(i + count) % villages.length];
      const farmer = farmers[(i * 2 + count) % farmers.length];
      const crop = crops[(i * 3 + count) % crops.length];

      // Realistic soil chemistry
      const pH = Number((6.2 + ((i * 7) % 23) * 0.1).toFixed(1)); // 6.2 to 8.4
      const ec = Number((0.35 + ((i * 5) % 15) * 0.08).toFixed(2)); // 0.35 to 1.55 dS/m
      const oc = Number((0.42 + ((i * 11) % 18) * 0.04).toFixed(2)); // 0.42 to 1.10%
      const n = 180 + ((i * 13) % 140); // kg/ha (low/med)
      const p = 14 + ((i * 9) % 28); // kg/ha
      const k = 190 + ((i * 17) % 190); // kg/ha
      const moisture = 14 + ((i * 4) % 16);

      // Score computation
      let score = 55;
      if (pH >= 6.5 && pH <= 7.8) score += 15;
      if (oc >= 0.75) score += 15;
      if (n >= 250) score += 8;
      if (p >= 20) score += 6;
      if (k >= 240) score += 6;

      const healthCategory: 'Excellent' | 'Good' | 'Moderate' | 'Degraded' = 
        score >= 85 ? 'Excellent' : (score >= 72 ? 'Good' : (score >= 60 ? 'Moderate' : 'Degraded'));

      samples.push({
        id: `SMP-${String(count).padStart(4, '0')}`,
        sampleCode: `ARK-${schoolId.replace('SCH-', '')}-${String(i).padStart(3, '0')}`,
        schoolId,
        studentId: stuId,
        studentName: `Student ${stuIndex}`,
        groupNumber: groupNum,
        date: `2026-06-${String(Math.min(28, (i % 24) + 1)).padStart(2, '0')}`,
        village,
        farmerName: farmer,
        farmerPhone: `+91 98${((i * 3141) % 90000000 + 10000000)}`,
        cropType: crop,
        parameters: {
          pH,
          ec,
          organicCarbon: oc,
          nitrogen: n,
          phosphorus: p,
          potassium: k,
          moisture,
          micronutrients: {
            zinc: Number((0.6 + ((i * 3) % 12) * 0.1).toFixed(2)),
            iron: Number((4.5 + ((i * 5) % 20) * 0.2).toFixed(1)),
            sulfur: 8 + ((i * 4) % 16),
            boron: Number((0.4 + ((i * 2) % 8) * 0.1).toFixed(2))
          }
        },
        healthScore: score,
        healthCategory,
        reportStatus: i % 4 === 0 ? 'Delivered' : (i % 6 === 0 ? 'Pending' : 'Generated'),
        soiLenzDeviceId: `SLZ-2026-${schoolId === 'SCH-01' ? '101' : (schoolId === 'SCH-02' ? '102' : '103')}`
      });
    }
  }

  return samples;
}

export function generateFarmerOutreach(): FarmerOutreach[] {
  const list: FarmerOutreach[] = [];
  const villages = ['Baramati Rural', 'Kalyanpur', 'Kashti', 'Anand Agri Block', 'Borsad', 'Tarapur', 'Rasulia Farm', 'Babai'];
  const crops = ['Sugarcane', 'Cotton', 'Paddy', 'Wheat', 'Soybean', 'Groundnut', 'Gram'];
  const adviceList = [
    'Apply 50kg gypsum/acre to correct sodicity; increase farm yard manure to raise organic carbon from 0.48% to 0.75%.',
    'Nitrogen levels adequate; reduce chemical urea by 25% and switch to neem-coated slow-release formulation.',
    'Phosphorus deficiency detected; recommend single super phosphate (SSP) basal dose combined with mycorrhizal bio-fertilizer.',
    'Optimal soil pH (7.1) and healthy carbon stock; sustain current crop rotation with green manuring (Dhaincha).'
  ];

  let count = 0;
  for (const schoolId of ['SCH-01', 'SCH-02', 'SCH-03']) {
    const totalOutreach = schoolId === 'SCH-01' ? 520 : (schoolId === 'SCH-02' ? 440 : 380);
    // Representative subset for state storage (e.g. 50 detailed records per school)
    for (let i = 1; i <= 35; i++) {
      count++;
      const groupNum = (i % 5) + 1;
      list.push({
        id: `OUT-${schoolId}-${String(i).padStart(3, '0')}`,
        schoolId,
        date: `2026-06-${String(Math.min(26, (i % 22) + 2)).padStart(2, '0')}`,
        groupNumber: groupNum,
        studentNames: [`Student Group ${groupNum} Leads`],
        village: villages[(i + count) % villages.length],
        farmerName: `Kisan ${farmersNames[(i * 3) % farmersNames.length]}`,
        phone: `+91 97${((i * 2718) % 90000000 + 10000000)}`,
        landAreaHectares: Number((1.2 + (i % 8) * 0.6).toFixed(1)),
        primaryCrop: crops[i % crops.length],
        soilSampleCode: `ARK-${schoolId.replace('SCH-', '')}-${String(i).padStart(3, '0')}`,
        adviceGiven: adviceList[i % adviceList.length],
        status: i % 5 === 0 ? 'Follow_Up' : 'Completed'
      });
    }
  }
  return list;
}

const farmersNames = ['Ramchandra', 'Vithal', 'Baburao', 'Mukund', 'Sanjay', 'Jagdish', 'Narayandas', 'Kalyanji', 'Haribhau', 'Devraj'];

export function generateCampaigns(): Campaign[] {
  return [
    {
      id: 'CMP-01',
      schoolId: 'SCH-01',
      date: '2026-06-08',
      title: 'Gram Panchayat Soil Health Awareness Drive',
      village: 'Malegaon Budruk',
      attendeesCount: 68,
      topicsCovered: 'Understanding Soil Health Cards, soil sample collection demos, reducing synthetic nitrogen runoff.',
      groupNumber: 1,
      photos: ['/assets/images/farmer-outreach.png']
    },
    {
      id: 'CMP-02',
      schoolId: 'SCH-01',
      date: '2026-06-15',
      title: 'Women Farmers Regenerative Agriculture Workshop',
      village: 'Kalyanpur',
      attendeesCount: 84,
      topicsCovered: 'Composting techniques, bio-fertilizer inoculation, vermiculture bedding.',
      groupNumber: 3,
      photos: ['/assets/images/farmer-outreach.png']
    },
    {
      id: 'CMP-03',
      schoolId: 'SCH-02',
      date: '2026-06-11',
      title: 'Anand Dairy Catchment Soil Carbon Seminar',
      village: 'Tarapur',
      attendeesCount: 95,
      topicsCovered: 'Fodder crop nutrition, testing cattle paddock soil salinity with SoiLENZ.',
      groupNumber: 2,
      photos: ['/assets/images/farmer-outreach.png']
    },
    {
      id: 'CMP-04',
      schoolId: 'SCH-03',
      date: '2026-06-14',
      title: 'Narmada Valley Sustainable Irrigation & Soil Care',
      village: 'Rasulia Farm',
      attendeesCount: 72,
      topicsCovered: 'Waterlogging mitigation, soil compaction relief, balanced potash application.',
      groupNumber: 4,
      photos: ['/assets/images/farmer-outreach.png']
    }
  ];
}

export function generateInventory(): InventoryItem[] {
  const items: InventoryItem[] = [];
  const schools = ['SCH-01', 'SCH-02', 'SCH-03', 'SCH-04'];

  for (const schoolId of schools) {
    items.push(
      {
        id: `INV-${schoolId}-01`,
        schoolId,
        itemName: 'SoiLENZ Digital Soil Testing Handheld Units',
        category: 'Device',
        totalQuantity: 2,
        usedQuantity: 2,
        unit: 'units',
        reorderLevel: 1,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-02`,
        schoolId,
        itemName: 'Standard Rapid Extraction Reagent Bottles (500ml)',
        category: 'Reagent',
        totalQuantity: 20,
        usedQuantity: 14,
        unit: 'bottles',
        reorderLevel: 5,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-03`,
        schoolId,
        itemName: 'Nitrile Protective Gloves (Box of 100)',
        category: 'Safety',
        totalQuantity: 10,
        usedQuantity: 7,
        unit: 'boxes',
        reorderLevel: 3,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-04`,
        schoolId,
        itemName: 'Core Stainless Soil Sampling Augers',
        category: 'Sampling_Kit',
        totalQuantity: 5,
        usedQuantity: 5,
        unit: 'units',
        reorderLevel: 2,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-05`,
        schoolId,
        itemName: 'Barcoded Soil Specimen Pouches (Pack of 200)',
        category: 'Sampling_Kit',
        totalQuantity: 5,
        usedQuantity: 4,
        unit: 'packs',
        reorderLevel: 2,
        status: 'Low'
      }
    );
  }

  return items;
}

export function generateAuditLogs(): AuditLog[] {
  return [
    {
      id: 'AUD-01',
      timestamp: '2026-06-20T10:15:00Z',
      actorName: 'Dr. Sunita Deshmukh',
      actorRole: 'partner',
      action: 'ELIGIBILITY_APPROVED',
      details: 'Approved Pragati Public School (SCH-04) eligibility with condition: sensor calibration.',
      schoolId: 'SCH-04'
    },
    {
      id: 'AUD-02',
      timestamp: '2026-06-19T17:45:00Z',
      actorName: 'Dr. Anjali Patil',
      actorRole: 'faculty',
      action: 'DAILY_LOG_SUBMITTED',
      details: 'Submitted Day 20 daily update (SoiLENZ Cross-validation, 14 samples tested).',
      schoolId: 'SCH-01'
    },
    {
      id: 'AUD-03',
      timestamp: '2026-06-18T14:20:00Z',
      actorName: 'Arkashine Super Admin',
      actorRole: 'arkashine',
      action: 'CERTIFICATE_ISSUED',
      details: 'Issued official "Soil Partner" certificates to 6 validated students of SCH-01.',
      schoolId: 'SCH-01'
    },
    {
      id: 'AUD-04',
      timestamp: '2026-06-17T11:30:00Z',
      actorName: 'Fr. Thomas Matthew',
      actorRole: 'principal',
      action: 'PRINCIPAL_REMARK_ADDED',
      details: 'Endorsed Week 3 daily log and approved student outreach field itinerary.',
      schoolId: 'SCH-01'
    }
  ];
}

export function generateNotifications(): NotificationItem[] {
  return [
    {
      id: 'NOTIF-01',
      title: 'Eligibility Approval Pending',
      message: 'Navodaya Adarsh Gurukulam (SCH-05) submitted updated Wi-Fi & Safety equipment proof.',
      timestamp: '2026-06-20T09:30:00Z',
      read: false,
      type: 'info',
      roleScope: ['arkashine', 'partner'],
      schoolId: 'SCH-05'
    },
    {
      id: 'NOTIF-02',
      title: 'Missed Daily Log Alert',
      message: 'Vidyasagar Krishi Vidyapeeth has 2 consecutive missing daily logs on Days 12 & 13.',
      timestamp: '2026-06-14T18:00:00Z',
      read: false,
      type: 'alert',
      roleScope: ['arkashine', 'partner', 'principal'],
      schoolId: 'SCH-02'
    },
    {
      id: 'NOTIF-03',
      title: 'Certificates Ready for Review',
      message: '12 students at St. Xavier’s have met all completion criteria and are ready for Arkashine issuance.',
      timestamp: '2026-06-19T16:00:00Z',
      read: false,
      type: 'success',
      roleScope: ['arkashine', 'partner', 'principal'],
      schoolId: 'SCH-01'
    }
  ];
}
