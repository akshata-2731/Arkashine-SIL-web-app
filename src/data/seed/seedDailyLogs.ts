import { School, DailyLog } from '../../types';

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
    // Generate dates relative to current date so Day currentWorkingDay corresponds to today (demo cohort)
    const now = new Date();
    const dayOffset = d - currentWorkingDay;
    const logDate = new Date(now.getTime() + dayOffset * 86400000);
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
        '/assets/images/module-soil-testing.webp',
        '/assets/images/module-sample-collection.webp'
      ] : [],
      principalRemarks: d % 5 === 0 ? 'Verified during routine lab round. Good student discipline and note-keeping.' : undefined,
      partnerRemarks: d === 14 ? 'Followed up with faculty regarding mid-program attendance dip. Compensatory classes scheduled.' : undefined,
      isLocked: d < currentWorkingDay - 2,
      submittedAt: status !== 'Missing' ? `${dateStr}T17:45:00Z` : undefined
    });
  }

  return logs;
}
