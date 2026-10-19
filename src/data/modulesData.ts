import { Badge } from '../types';

export interface ModuleTopic {
  id: string;
  title: string;
  theoryHours: number;
  practicalHours: number;
  description: string;
  keyConcepts: string[];
}

export interface CurriculumModule {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  allocatedHours: number; // 18 hrs each = 72 hrs total
  image: string;
  description: string;
  assessmentType: 'Quiz' | 'Quiz + Field Assignment' | 'Quiz + SoiLENZ Challenge' | 'Quiz + Capstone';
  topics: ModuleTopic[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 1,
    code: 'MOD-01',
    title: 'Introduction to Agriculture & Soil Science (Theory)',
    subtitle: 'The living foundation of planetary & farm health',
    allocatedHours: 18,
    image: '/assets/images/module-agri-science.png',
    description: 'Theory Foundation: Foundational soil physics, chemistry, soil horizons, organic carbon dynamics, and regenerative agriculture principles.',
    assessmentType: 'Quiz',
    topics: [
      {
        id: '1.1',
        title: 'Soil Composition & Physical Structure',
        theoryHours: 3,
        practicalHours: 1,
        description: 'Mineral components, organic fraction, soil horizons (O, A, B, C), texture feel method.',
        keyConcepts: ['Soil horizons', 'Sand-silt-clay ribbon test', 'Bulk density', 'Pore space']
      },
      {
        id: '1.2',
        title: 'Soil Chemistry: pH, Salinity & CEC',
        theoryHours: 3,
        practicalHours: 1,
        description: 'Acidic vs alkaline soils, electrical conductivity (EC), cation exchange capacity, buffering.',
        keyConcepts: ['pH scale 1-14', 'EC (dS/m)', 'Nutrient availability curve', 'Liming & gypsum']
      },
      {
        id: '1.3',
        title: 'Macro & Micronutrients Cycle',
        theoryHours: 3,
        practicalHours: 1,
        description: 'Primary N-P-K cycle, secondary nutrients (Ca, Mg, S) and trace minerals in Indian agronomy.',
        keyConcepts: ['Nitrogen fixation', 'Phosphorus fixation', 'Potassium uptake', 'Deficiency symptoms']
      },
      {
        id: '1.4',
        title: 'Soil Biology & Regenerative Agriculture',
        theoryHours: 3,
        practicalHours: 1,
        description: 'Microbiome, mycorrhizal fungi, soil organic carbon (SOC) sequestration and cover cropping.',
        keyConcepts: ['Microbial biomass', 'Humus', 'Composting', 'Zero tillage']
      }
    ]
  },
  {
    id: 2,
    code: 'MOD-02',
    title: 'Soil Sample Collection & Preparation (Practical)',
    subtitle: 'Precision sampling protocols from field to lab',
    allocatedHours: 18,
    image: '/assets/images/module-sample-collection.png',
    description: 'Hands-on Practical: Standardized auger sampling, zig-zag spatial field grids, GPS geotagging, composite quartering, and drying techniques.',
    assessmentType: 'Quiz + Field Assignment',
    topics: [
      {
        id: '2.1',
        title: 'Field Topography & Sampling Grid Design',
        theoryHours: 1,
        practicalHours: 3.5,
        description: 'Demarcating uniform field parcels, avoiding fence/tree zones, zig-zag traversing.',
        keyConcepts: ['Zig-zag path', 'Representative sampling', 'Slope & drainage stratification']
      },
      {
        id: '2.2',
        title: 'Auger Core Extraction & Geotagging',
        theoryHours: 1,
        practicalHours: 3.5,
        description: 'V-shaped cut (0-15cm furrow depth), auger operation, GPS location tagging, sample coding.',
        keyConcepts: ['0-15cm arable layer', 'Core auger handling', 'Georeferenced coordinates']
      },
      {
        id: '2.3',
        title: 'Quartering, Subsampling & Contamination Prevention',
        theoryHours: 1,
        practicalHours: 3.5,
        description: 'Composite mixing, circular quartering technique, reduction to 500g laboratory sample.',
        keyConcepts: ['Quartering method', 'Zero-cross-contamination', 'Standard label metadata']
      },
      {
        id: '2.4',
        title: 'Sample Drying, Grinding & Sieve Protocol',
        theoryHours: 1,
        practicalHours: 3.5,
        description: 'Shade drying trays, wooden pestle crushing, 2mm stainless steel sieving.',
        keyConcepts: ['Shade air drying', '2mm mesh sieve', 'Moisture determination', 'Archive retention']
      }
    ]
  },
  {
    id: 3,
    code: 'MOD-03',
    title: 'Soil Testing using SoiLENZ Device (Practical)',
    subtitle: 'Handheld spectroscopic & electrochemical rapid testing',
    allocatedHours: 18,
    image: '/assets/images/module-soil-testing.png',
    description: 'Hands-on Practical: Operating Arkashine’s proprietary SoiLENZ handheld digital device, sensor calibration, reagent reaction dishes, and instant telemetry.',
    assessmentType: 'Quiz + SoiLENZ Challenge',
    topics: [
      {
        id: '3.1',
        title: 'SoiLENZ Architecture & Optical Sensors',
        theoryHours: 1,
        practicalHours: 3,
        description: 'NIR reflectance, electrochemical probe mechanics, Bluetooth sync with mobile gateway.',
        keyConcepts: ['Handheld spectrometry', 'Sensor optical window', 'Battery & calibration cycle']
      },
      {
        id: '3.2',
        title: 'Device Calibration & Buffer Solutions',
        theoryHours: 1,
        practicalHours: 3.5,
        description: 'Zero-standard white reference calibration, pH 4.0 / 7.0 buffer checks, conductivity baseline.',
        keyConcepts: ['Two-point calibration', 'Sensor drift tolerance', 'Deionized water hygiene']
      },
      {
        id: '3.3',
        title: 'Sample Loading & Rapid Reading Execution',
        theoryHours: 1,
        practicalHours: 4,
        description: 'Quartz cuvette loading, tamp density, automated 90-second multi-parameter scan.',
        keyConcepts: ['90-second scan', 'Repeatability test', 'Optical cuvette care']
      },
      {
        id: '3.4',
        title: 'Quality Control, Outliers & Validation Triangulation',
        theoryHours: 1,
        practicalHours: 3.5,
        description: 'Triplicate test averages, detecting error codes, validating against wet-lab colorimetric charts.',
        keyConcepts: ['Standard deviation <5%', 'Outlier rejection', 'Digital handshake']
      }
    ]
  },
  {
    id: 4,
    code: 'MOD-04',
    title: 'Soil Health Reports & Farmer Advisory (Practical)',
    subtitle: 'Translating laboratory numbers into real farm prosperity',
    allocatedHours: 18,
    image: '/assets/images/module-health-reports.png',
    description: 'Hands-on Practical: Interpreting soil health cards, nutrient deficiency diagnostics, organic vs chemical fertilizer balancing, and conducting village farmer advisory meetings.',
    assessmentType: 'Quiz + Capstone',
    topics: [
      {
        id: '4.1',
        title: 'Anatomy of the Arkashine Soil Health Card',
        theoryHours: 2,
        practicalHours: 2,
        description: 'Rating parameters: Low, Medium, High; Soil Health Index calculation (0-100).',
        keyConcepts: ['Soil Health Index', 'Parameter benchmarks', 'Visual radar charts']
      },
      {
        id: '4.2',
        title: 'Customized Fertilizer Recommendation (CFR)',
        theoryHours: 2,
        practicalHours: 2.5,
        description: 'Calculating crop-specific nutrient requirements (paddy, wheat, cotton, pulses) and organic amendments.',
        keyConcepts: ['Basal vs top-dressing', 'FYM / Vermicompost dosing', 'Urea-DAP-MOP reduction']
      },
      {
        id: '4.3',
        title: 'Farmer Advisory Communication & Vernacular Dialogue',
        theoryHours: 2,
        practicalHours: 3,
        description: 'Role-playing consultations, explaining Soil Health Cards in simple language, overcoming traditional hesitation.',
        keyConcepts: ['Empathetic listening', 'Vernacular terminology', 'Economic ROI explanation']
      },
      {
        id: '4.4',
        title: 'Community Soil Awareness Campaigns & Capstone',
        theoryHours: 2,
        practicalHours: 2.5,
        description: 'Organizing village gatherings, street-corner soil demos, group capstone presentation.',
        keyConcepts: ['Village panchayat outreach', 'Campaign documentation', 'Peer review capstone']
      }
    ]
  }
];

export interface JourneyStep {
  step: number;
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  description: string;
  completedIconColor: string;
}

export const SOIL_JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    id: 'collect',
    title: 'Collect',
    tagline: 'Precision Field Extraction',
    iconName: 'Compass',
    description: 'Use the 0-15cm auger protocol in a zig-zag field grid to harvest representative soil cores.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 2,
    id: 'prepare',
    title: 'Prepare',
    tagline: 'Drying, Quartering & Sieve',
    iconName: 'Filter',
    description: 'Air-dry the soil, crush clods with wooden mortar, quarter down to 500g, and pass through a 2mm mesh.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 3,
    id: 'test',
    title: 'Test',
    tagline: 'SoiLENZ Handheld Scan',
    iconName: 'Cpu',
    description: 'Load the sample dish into the calibrated SoiLENZ sensor and run the 90-second digital scan.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 4,
    id: 'record',
    title: 'Record',
    tagline: 'Digital Cloud Telemetry',
    iconName: 'Database',
    description: 'Log sample ID, GPS coordinates, farmer identity, crop history, and raw sensor readings.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 5,
    id: 'analyze',
    title: 'Analyze',
    tagline: 'Macro & Micro Metrics',
    iconName: 'BarChart3',
    description: 'Evaluate pH (acidity/alkalinity), EC (salinity), organic carbon %, and N-P-K nutrient status.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 6,
    id: 'interpret',
    title: 'Interpret',
    tagline: 'Crop Science Diagnostic',
    iconName: 'Activity',
    description: 'Compare test values against local agricultural benchmarks and pinpoint soil stress factors.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 7,
    id: 'report',
    title: 'Report',
    tagline: 'Soil Health Card Delivery',
    iconName: 'FileCheck',
    description: 'Generate the official Arkashine Soil Health Card with tailored fertilizer & compost recommendations.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 8,
    id: 'apply',
    title: 'Apply',
    tagline: 'Farmer Action in the Field',
    iconName: 'Leaf',
    description: 'Counsel the farmer in the field, track input adjustments, and verify sustainable soil stewardship.',
    completedIconColor: 'bg-emerald-600 text-white'
  }
];

export const SYSTEM_BADGES: Badge[] = [
  {
    id: 'badge-sampler',
    name: 'Master Sampler',
    description: 'Collected over 20 verified soil samples using precision zig-zag GPS protocol.',
    icon: 'Compass',
    category: 'sampling'
  },
  {
    id: 'badge-tester',
    name: 'SoiLENZ Certified Tester',
    description: 'Achieved 100% calibration precision and logged 30+ handheld scans without error.',
    icon: 'Cpu',
    category: 'testing'
  },
  {
    id: 'badge-reporter',
    name: 'Data Analyst & Reporter',
    description: 'Generated 15+ comprehensive Soil Health Cards with customized fertilizer dosage.',
    icon: 'FileCheck',
    category: 'reporting'
  },
  {
    id: 'badge-farmer-friend',
    name: 'Farmer Friend',
    description: 'Conducted field visits and engaged directly with over 50 local farming families.',
    icon: 'Users',
    category: 'outreach'
  },
  {
    id: 'badge-ambassador',
    name: 'Soil Ambassador',
    description: 'Led a village community campaign on organic carbon and climate-resilient soils.',
    icon: 'Award',
    category: 'leadership'
  }
];
