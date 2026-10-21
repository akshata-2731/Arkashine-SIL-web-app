import { ChecklistItem } from '../../types';

export const createInitialChecklist = (schoolCode: string): ChecklistItem[] => {
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
      label: 'Running Water Tap & Drainage Sink for Glassware Cleaning',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'No sink in room; nearest washbasin is 40m away in corridor' : 'Ceramic wash sink with active drainage and splash guard'
    },
    {
      id: `${schoolCode}-chk-9`,
      category: 'Infrastructure',
      label: 'Dry Waste & Chemical Extraction Disposal Bin Protocol',
      status: 'yes',
      notes: 'Color-coded bins installed for glass, filter paper, and neutralizing solution'
    },
    {
      id: `${schoolCode}-chk-10`,
      category: 'Infrastructure',
      label: 'Projector / TV Screen for Curriculum Micro-Lectures',
      status: isPending ? 'needs_fix' : 'yes',
      notes: isPending ? 'Wall mounting bracket installed; smart display awaiting delivery' : '55-inch HDMI smart screen installed and tested with faculty laptop',
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
      category: 'Students',
      label: 'Balanced Cohort Selection: Minimum 40% Girls Representation',
      status: 'yes',
      notes: 'Target 50% girls achieved in shortlisted cohort'
    },
    {
      id: `${schoolCode}-chk-18`,
      category: 'Agreement',
      label: 'Signed Tri-Party MoU (School, Arkashine, Enabling Partner)',
      status: isRejected ? 'no' : 'yes',
      notes: isRejected ? 'MoU unsigned due to dispute over asset ownership clauses' : 'Executed MoU archived in cloud doc vault'
    }
  ];
};
