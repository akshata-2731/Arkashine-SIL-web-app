import { BudgetLine } from '../types';

export const INITIAL_BUDGET_LINES: BudgetLine[] = [
  // 1. Equipment & Hardware (Rs. 1,40,000)
  {
    id: 'BL-01',
    code: 'EQP-01',
    category: 'Equipment & Hardware',
    description: 'SoiLENZ Handheld Spectroscopic Sensor Device (2 units)',
    plannedAmount: 80000,
    actualAmount: 80000,
    variance: 0,
    status: 'Within_Budget',
    notes: 'Arkashine calibrated units deployed in school lab corner'
  },
  {
    id: 'BL-02',
    code: 'EQP-02',
    category: 'Equipment & Hardware',
    description: 'Optical Cuvettes & Quartz Reflection Cells (set of 6)',
    plannedAmount: 12000,
    actualAmount: 11400,
    variance: 600,
    status: 'Within_Budget',
    notes: 'Optical grade quartz cuvettes'
  },
  {
    id: 'BL-03',
    code: 'EQP-03',
    category: 'Equipment & Hardware',
    description: 'Digital Precision Balance (0.01g readability)',
    plannedAmount: 8500,
    actualAmount: 8200,
    variance: 300,
    status: 'Within_Budget',
    notes: 'Dual AC/battery powered tare balance'
  },
  {
    id: 'BL-04',
    code: 'EQP-04',
    category: 'Equipment & Hardware',
    description: 'Tablet Computer / Mobile Data Gateway for Telemetry',
    plannedAmount: 25000,
    actualAmount: 24500,
    variance: 500,
    status: 'Within_Budget',
    notes: 'Pre-loaded with Arkashine Mobile Telemetry App'
  },
  {
    id: 'BL-05',
    code: 'EQP-05',
    category: 'Equipment & Hardware',
    description: 'Laboratory Glassware (beakers, cylinders, flasks)',
    plannedAmount: 14500,
    actualAmount: 15100,
    variance: -600,
    status: 'Near_Limit',
    notes: 'Borosilicate glassware kit'
  },

  // 2. Reagents & Testing Consumables (Rs. 75,000)
  {
    id: 'BL-06',
    code: 'REA-01',
    category: 'Reagents & Consumables',
    description: 'SoiLENZ Standard Extractant & Buffer Solutions (1000 tests)',
    plannedAmount: 28000,
    actualAmount: 26500,
    variance: 1500,
    status: 'Within_Budget',
    notes: 'Rapid extraction chemical packs'
  },
  {
    id: 'BL-07',
    code: 'REA-02',
    category: 'Reagents & Consumables',
    description: 'Deionized / Distilled Water (200 Liters)',
    plannedAmount: 6000,
    actualAmount: 5800,
    variance: 200,
    status: 'Within_Budget',
    notes: 'High purity analytical water jars'
  },
  {
    id: 'BL-08',
    code: 'REA-03',
    category: 'Reagents & Consumables',
    description: 'pH & Electrical Conductivity (EC) Calibration Standards',
    plannedAmount: 9000,
    actualAmount: 9200,
    variance: -200,
    status: 'Within_Budget',
    notes: 'NIST traceable standard solutions'
  },
  {
    id: 'BL-09',
    code: 'REA-04',
    category: 'Reagents & Consumables',
    description: 'Disposable Filter Papers (Whatman No. 1, 10 packs)',
    plannedAmount: 12000,
    actualAmount: 11000,
    variance: 1000,
    status: 'Within_Budget',
    notes: 'Ashless fast filtration papers'
  },
  {
    id: 'BL-10',
    code: 'REA-05',
    category: 'Reagents & Consumables',
    description: 'Reagent Waste Neutralization & Safe Disposal Packs',
    plannedAmount: 20000,
    actualAmount: 18500,
    variance: 1500,
    status: 'Within_Budget',
    notes: 'Environmentally safe neutralizing agents'
  },

  // 3. Soil Sampling Tools & Kits (Rs. 55,000)
  {
    id: 'BL-11',
    code: 'SMP-01',
    category: 'Sampling Tools & Kits',
    description: 'Stainless Steel Core Soil Augers (5 units)',
    plannedAmount: 18000,
    actualAmount: 17500,
    variance: 500,
    status: 'Within_Budget',
    notes: 'V-notch heavy duty augers with depth graduation'
  },
  {
    id: 'BL-12',
    code: 'SMP-02',
    category: 'Sampling Tools & Kits',
    description: 'High-Density Barcoded Soil Collection Bags (1000 units)',
    plannedAmount: 12000,
    actualAmount: 12400,
    variance: -400,
    status: 'Within_Budget',
    notes: 'Moisture-resistant printed specimen pouches'
  },
  {
    id: 'BL-13',
    code: 'SMP-03',
    category: 'Sampling Tools & Kits',
    description: 'Stainless Steel 2mm Soil Test Sieves & Catch Pans',
    plannedAmount: 9000,
    actualAmount: 8600,
    variance: 400,
    status: 'Within_Budget',
    notes: 'Standard 200mm diameter test sieves'
  },
  {
    id: 'BL-14',
    code: 'SMP-04',
    category: 'Sampling Tools & Kits',
    description: 'Wooden Pestles & Soil Sample Drying Trays',
    plannedAmount: 8000,
    actualAmount: 7800,
    variance: 200,
    status: 'Within_Budget',
    notes: 'Non-contaminating wood mortars and drying racks'
  },
  {
    id: 'BL-15',
    code: 'SMP-05',
    category: 'Sampling Tools & Kits',
    description: 'Field Backpacks & Geotagging GPS Clip-ons (5 sets)',
    plannedAmount: 8000,
    actualAmount: 8200,
    variance: -200,
    status: 'Within_Budget',
    notes: 'Student fieldwork gear for rural transit'
  },

  // 4. Pedagogical & Training Material (Rs. 45,000)
  {
    id: 'BL-16',
    code: 'TRN-01',
    category: 'Pedagogy & Training',
    description: 'Student Lab Workbooks & Soil Science Field Guides (25 copies)',
    plannedAmount: 15000,
    actualAmount: 14200,
    variance: 800,
    status: 'Within_Budget',
    notes: 'Full-color spiral-bound modules and logs'
  },
  {
    id: 'BL-17',
    code: 'TRN-02',
    category: 'Pedagogy & Training',
    description: 'Faculty Master Trainer Curriculum & Teacher Handbook',
    plannedAmount: 8000,
    actualAmount: 7500,
    variance: 500,
    status: 'Within_Budget',
    notes: 'Detailed 72-hour teaching plan and rubrics'
  },
  {
    id: 'BL-18',
    code: 'TRN-03',
    category: 'Pedagogy & Training',
    description: 'Interactive Soil Diagnostic Wall Charts & Infographics',
    plannedAmount: 10000,
    actualAmount: 10800,
    variance: -800,
    status: 'Near_Limit',
    notes: 'Display boards for school innovation corner'
  },
  {
    id: 'BL-19',
    code: 'TRN-04',
    category: 'Pedagogy & Training',
    description: 'Innovation Hackathon Awards & Capstone Presentation Kits',
    plannedAmount: 12000,
    actualAmount: 11900,
    variance: 100,
    status: 'Within_Budget',
    notes: 'Student cohort awards and presentation stands'
  },

  // 5. Outreach & Community Campaigns (Rs. 85,000)
  {
    id: 'BL-20',
    code: 'OUT-01',
    category: 'Outreach & Field Campaigns',
    description: 'Color Printed Soil Health Cards for 750 Farmers',
    plannedAmount: 30000,
    actualAmount: 28600,
    variance: 1400,
    status: 'Within_Budget',
    notes: 'Laminated, QR-verified cards delivered to farmers'
  },
  {
    id: 'BL-21',
    code: 'OUT-02',
    category: 'Outreach & Field Campaigns',
    description: 'Village Community Campaign Banners & Standees (30 events)',
    plannedAmount: 18000,
    actualAmount: 18400,
    variance: -400,
    status: 'Within_Budget',
    notes: 'Vernacular awareness boards for Gram Panchayats'
  },
  {
    id: 'BL-22',
    code: 'OUT-03',
    category: 'Outreach & Field Campaigns',
    description: 'Student Field Transit & Local Farmer Visit Transport',
    plannedAmount: 20000,
    actualAmount: 21500,
    variance: -1500,
    status: 'Near_Limit',
    notes: 'Covers rural village travel across 6 field days'
  },
  {
    id: 'BL-23',
    code: 'OUT-04',
    category: 'Outreach & Field Campaigns',
    description: 'Farmer Advisory Meeting Refreshments & Logistics',
    plannedAmount: 10000,
    actualAmount: 9400,
    variance: 600,
    status: 'Within_Budget',
    notes: 'Tea, water and shamiana during village sessions'
  },
  {
    id: 'BL-24',
    code: 'OUT-05',
    category: 'Outreach & Field Campaigns',
    description: 'Soil Stewardship Audio-Visual Demonstration Gear',
    plannedAmount: 7000,
    actualAmount: 6800,
    variance: 200,
    status: 'Within_Budget',
    notes: 'Portable PA speaker & mic for village square demos'
  },

  // 6. Safety, Honorariums & Admin (Rs. 1,00,000)
  {
    id: 'BL-25',
    code: 'ADM-01',
    category: 'Safety & Administration',
    description: 'Personal Protective Equipment (Nitrile gloves, goggles, aprons)',
    plannedAmount: 15000,
    actualAmount: 14600,
    variance: 400,
    status: 'Within_Budget',
    notes: 'Student safety sets for 20 students & faculty'
  },
  {
    id: 'BL-26',
    code: 'ADM-02',
    category: 'Safety & Administration',
    description: 'First Aid Kit & Emergency Eyewash Station',
    plannedAmount: 5000,
    actualAmount: 4800,
    variance: 200,
    status: 'Within_Budget',
    notes: 'Compliant with school laboratory safety checklist'
  },
  {
    id: 'BL-27',
    code: 'ADM-03',
    category: 'Safety & Administration',
    description: 'Faculty Coordinator Summer Program Honorarium (72 hours)',
    plannedAmount: 45000,
    actualAmount: 45000,
    variance: 0,
    status: 'Within_Budget',
    notes: 'Approved stipend for daily instruction & logging'
  },
  {
    id: 'BL-28',
    code: 'ADM-04',
    category: 'Safety & Administration',
    description: 'School Innovation Committee Oversight & Audit Contingency',
    plannedAmount: 15000,
    actualAmount: 12300,
    variance: 2700,
    status: 'Within_Budget',
    notes: 'Principal & committee review meetings allowance'
  },
  {
    id: 'BL-29',
    code: 'ADM-05',
    category: 'Safety & Administration',
    description: 'Final Certification Convocation & Leaflet Dossier',
    plannedAmount: 20000,
    actualAmount: 18900,
    variance: 1100,
    status: 'Within_Budget',
    notes: 'Ceremonial certificate presentation & parent invitations'
  }
];
