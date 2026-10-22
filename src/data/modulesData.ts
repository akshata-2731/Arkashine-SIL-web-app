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
  allocatedHours: number; // 12 hrs each = 72 hrs total
  image: string;
  description: string;
  assessmentType: string;
  learningOutcomes: string[];
  handsOnLabActivities: string[];
  theorySummary: string;
  topics: ModuleTopic[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 1,
    code: 'MOD-01',
    title: 'Basics of Agriculture & Living Soil Science',
    subtitle: 'The living foundation of planetary & farm health',
    allocatedHours: 12,
    image: '/assets/images/module-agri-science.png',
    description: 'Foundational soil physics, biology, soil horizons (O, A, B, C), earthworms, mycorrhizal fungi, and organic carbon dynamics.',
    assessmentType: 'Quiz',
    theorySummary: 'Soil is a dynamic living ecosystem. A single teaspoon contains over 1 billion beneficial microbes. The topsoil (A-Horizon) acts as the biological engine where earthworms burrow aeration channels and mycorrhizae trade phosphorus with crop roots in exchange for photosynthetic sugars.',
    learningOutcomes: [
      'Understand why healthy living soil is the cornerstone of sustainable agriculture.',
      'Identify and describe the 4 major soil horizons (O, A, B, and C/R bedrock).',
      'Explain how earthworms and mycorrhizal fungi accelerate root nutrient absorption.'
    ],
    handsOnLabActivities: [
      'Field soil texture ribbon test to estimate sand, silt, and clay fractions.',
      'Microscopic examination of earthworm castings and root feeder hair density.',
      'Soil crumb porosity test comparing organic humus soil with compacted dirt.'
    ],
    topics: [
      {
        id: '1.1',
        title: 'Soil Composition & Physical Structure',
        theoryHours: 2,
        practicalHours: 1,
        description: 'Mineral components, organic fraction, soil horizons (O, A, B, C), texture feel method.',
        keyConcepts: ['Soil horizons', 'Sand-silt-clay ribbon test', 'Bulk density', 'Pore space']
      },
      {
        id: '1.2',
        title: 'Soil Biology & Regenerative Agriculture',
        theoryHours: 2,
        practicalHours: 1,
        description: 'Microbiome, mycorrhizal fungi, soil organic carbon (SOC) sequestration and cover cropping.',
        keyConcepts: ['Microbial biomass', 'Humus', 'Composting', 'Zero tillage']
      },
      {
        id: '1.3',
        title: 'Primary Macronutrients (N-P-K) Cycle',
        theoryHours: 2,
        practicalHours: 1,
        description: 'Nitrogen for foliage, Phosphorus for roots, Potassium for stalk strength and stress shield.',
        keyConcepts: ['Nitrogen fixation', 'Phosphorus uptake', 'Potassium regulation', 'Deficiency signs']
      },
      {
        id: '1.4',
        title: 'Living Soil vs. Dead Compacted Dirt',
        theoryHours: 2,
        practicalHours: 1,
        description: 'Biological carbon cycling, water infiltration capacity, and soil health indicators.',
        keyConcepts: ['Carbon-to-Nitrogen ratio', 'Soil aggregation', 'Moisture holding capacity']
      }
    ]
  },
  {
    id: 2,
    code: 'MOD-02',
    title: 'Precision Field Sampling Protocols & Tools',
    subtitle: 'Standardized field core extraction from farm to school lab',
    allocatedHours: 12,
    image: '/assets/images/module-sample-collection.png',
    description: 'Standardized 0-15cm furrow core sampling, zig-zag spatial field grids, GPS geotagging, composite quartering, and drying techniques.',
    assessmentType: 'Quiz + Field Assignment',
    theorySummary: 'Accurate laboratory analysis depends entirely on representative field sampling. Sampling must be conducted across a zig-zag grid at 0-15cm depth, avoiding fence lines, trees, and manure heaps to eliminate contamination bias.',
    learningOutcomes: [
      'Master the 0-15cm V-shaped furrow slice using agricultural augers and stainless spades.',
      'Design zig-zag spatial sampling paths across varied field topography.',
      'Execute the composite quartering method to reduce 10kg field soil to a clean 500g lab sample.'
    ],
    handsOnLabActivities: [
      'Zig-zag field traversal and core extraction in local school or farm plot.',
      'Circular composite quartering on clean tarpaulin to isolate representative 500g batch.',
      'Shade drying on kraft paper trays and 2mm stainless steel mesh sieving.'
    ],
    topics: [
      {
        id: '2.1',
        title: 'Field Topography & Sampling Grid Design',
        theoryHours: 1,
        practicalHours: 2,
        description: 'Demarcating uniform field parcels, avoiding fence/tree zones, zig-zag traversing.',
        keyConcepts: ['Zig-zag path', 'Representative sampling', 'Topographic stratification']
      },
      {
        id: '2.2',
        title: 'Auger Core Extraction & Geotagging',
        theoryHours: 1,
        practicalHours: 2,
        description: 'V-shaped cut (0-15cm furrow depth), auger operation, GPS location tagging, sample coding.',
        keyConcepts: ['0-15cm arable layer', 'Core auger handling', 'Georeferenced coordinates']
      },
      {
        id: '2.3',
        title: 'Quartering & Contamination Prevention',
        theoryHours: 1,
        practicalHours: 2,
        description: 'Composite mixing, circular quartering technique, reduction to 500g laboratory sample.',
        keyConcepts: ['Quartering method', 'Zero-cross-contamination', 'Standard label metadata']
      },
      {
        id: '2.4',
        title: 'Sample Drying, Grinding & Sieve Protocol',
        theoryHours: 1,
        practicalHours: 2,
        description: 'Shade drying trays, wooden pestle crushing, 2mm stainless steel sieving.',
        keyConcepts: ['Shade air drying', '2mm mesh sieve', 'Moisture determination', 'Archive retention']
      }
    ]
  },
  {
    id: 3,
    code: 'MOD-03',
    title: 'SoiLENZ Handheld Device Operation & Rapid Testing',
    subtitle: 'Handheld spectroscopic & multi-sensor rapid diagnostics',
    allocatedHours: 12,
    image: '/assets/images/module-soil-testing.png',
    description: 'Operating Arkashine’s proprietary SoiLENZ handheld digital device, sensor calibration, reagent reaction dishes, and instant telemetry.',
    assessmentType: 'Quiz + SoiLENZ Challenge',
    theorySummary: 'The SoiLENZ diagnostic device integrates optical spectroscopic absorption with electrochemical sensors. By dipping the multi-sensor probe into a single-reagent soil extract, it captures live readings of 14 soil health parameters in just 15 minutes.',
    learningOutcomes: [
      'Operate the SoiLENZ portable testing console and interpret optical sensor telemetry.',
      'Prepare single-reagent soil extracts with deionized water according to standard protocols.',
      'Perform sensor calibration using standard buffer solutions and resolve error codes.'
    ],
    handsOnLabActivities: [
      'Single-reagent liquid extraction and settling in calibrated test beakers.',
      'Two-point sensor calibration using pH 4.0 and 7.0 buffer reference solutions.',
      'Running automated 90-second digital multi-parameter scans on live student samples.'
    ],
    topics: [
      {
        id: '3.1',
        title: 'SoiLENZ Architecture & Optical Sensors',
        theoryHours: 1,
        practicalHours: 2,
        description: 'NIR reflectance, electrochemical probe mechanics, Bluetooth sync with mobile gateway.',
        keyConcepts: ['Handheld spectrometry', 'Sensor optical window', 'Calibration baseline']
      },
      {
        id: '3.2',
        title: 'Device Calibration & Buffer Standards',
        theoryHours: 1,
        practicalHours: 2,
        description: 'Zero-standard white reference calibration, pH buffer checks, conductivity baseline.',
        keyConcepts: ['Two-point calibration', 'Sensor drift tolerance', 'Deionized water hygiene']
      },
      {
        id: '3.3',
        title: 'Sample Loading & Rapid Scan Execution',
        theoryHours: 1,
        practicalHours: 2,
        description: 'Quartz cuvette loading, tamp density, automated 90-second multi-parameter scan.',
        keyConcepts: ['90-second scan', 'Repeatability test', 'Optical cuvette care']
      },
      {
        id: '3.4',
        title: 'Quality Control & Triplicate Verification',
        theoryHours: 1,
        practicalHours: 2,
        description: 'Triplicate test averages, detecting error codes, validating against colorimetric benchmarks.',
        keyConcepts: ['Standard deviation <5%', 'Outlier rejection', 'Digital cloud telemetry']
      }
    ]
  },
  {
    id: 4,
    code: 'MOD-04',
    title: 'Soil Chemistry, pH Dynamics & Nutrient Lockout',
    subtitle: "Liebig's Law of Minimum, bio-availability and chemical balancing",
    allocatedHours: 12,
    image: '/assets/images/poster-why-test-soil.png',
    description: 'Understanding the 4.0–10.0 pH scale, electrical conductivity (EC), Cation Exchange Capacity (CEC), and chemical nutrient fixation.',
    assessmentType: 'Quiz',
    theorySummary: 'Soil pH is the master chemical regulator of plant nutrition. Below pH 5.5, toxic aluminum dissolves and chemically locks out phosphorus. Above pH 8.0, calcium binds phosphorus while iron and zinc precipitate, causing severe crop chlorosis.',
    learningOutcomes: [
      'Explain how soil pH directly controls the bio-availability of N, P, K, and micronutrients.',
      'Differentiate between acid soil liming (CaCO3) and alkaline soil gypsum (CaSO4) reclamation.',
      'Evaluate Electrical Conductivity (EC) to assess soil salinity risks for crop germination.'
    ],
    handsOnLabActivities: [
      'Electrochemical pH and EC measurement of 4 contrasting local soil samples.',
      'Simulating nutrient lockout curves and observing colorimetric chemical shifts.',
      'Calculating exact agricultural lime dosage to buffer acidic soils to optimal pH 6.8.'
    ],
    topics: [
      {
        id: '4.1',
        title: 'The Soil pH Spectrum (0 to 14)',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Hydrogen ion concentration, acidic vs alkaline soil chemistry, buffering capacity.',
        keyConcepts: ['pH scale', 'Hydrogen & Hydroxyl ions', 'Soil buffering index']
      },
      {
        id: '4.2',
        title: "Nutrient Lockout Curves & Liebig's Law",
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Phosphorus fixation in acid/alkaline soils, micronutrient iron/zinc lockout.',
        keyConcepts: ["Liebig's Law of Minimum", 'Phosphorus fixation', 'Trace mineral chlorosis']
      },
      {
        id: '4.3',
        title: 'Electrical Conductivity (EC) & Salinity',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Soluble salt concentration, osmotic root shock, sodic soil reclamation.',
        keyConcepts: ['EC in dS/m', 'Saline vs sodic soils', 'Osmotic pressure']
      },
      {
        id: '4.4',
        title: 'Soil Reclamation: Lime & Gypsum Formulations',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Neutralizing acid soils with Agricultural Lime (CaCO3) and sodic soils with Gypsum (CaSO4).',
        keyConcepts: ['Agricultural Lime (CaCO3)', 'Gypsum (CaSO4)', 'Organic vermicompost buffering']
      }
    ]
  },
  {
    id: 5,
    code: 'MOD-05',
    title: 'Interpreting Soil Health Reports & Fertilizer Planning',
    subtitle: 'Translating raw laboratory metrics into customized farm prosperity',
    allocatedHours: 12,
    image: '/assets/images/module-health-reports.png',
    description: 'Anatomy of the Arkashine Soil Health Card, Soil Health Index (SHI), customized fertilizer recommendations (CFR), and organic balancing.',
    assessmentType: 'Quiz',
    theorySummary: 'A soil report is only useful when converted into actionable agricultural advice. Students learn to decode radar charts and parameter ratings (Low, Medium, High) to calculate Customized Fertilizer Recommendations (CFR) combining organic manure with targeted mineral inputs.',
    learningOutcomes: [
      'Read and interpret the Arkashine Soil Health Card and overall Soil Health Index score.',
      'Calculate crop-specific CFR dosages for wheat, paddy, cotton, and pulses.',
      'Design balanced nutrition plans that replace excessive synthetic urea with organic compost.'
    ],
    handsOnLabActivities: [
      'Audit and decode 3 real farmer Soil Health Cards from local agricultural blocks.',
      'Drafting customized fertilizer dosage tickets tailored to specific target crop yields.',
      'Calculating farmer economic savings from eliminating unneeded chemical inputs.'
    ],
    topics: [
      {
        id: '5.1',
        title: 'Anatomy of the Arkashine Soil Health Card',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Rating parameters: Low, Medium, High; Soil Health Index calculation (0-100).',
        keyConcepts: ['Soil Health Index', 'Parameter benchmarks', 'Visual radar charts']
      },
      {
        id: '5.2',
        title: 'Customized Fertilizer Recommendation (CFR)',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Calculating crop-specific nutrient requirements (paddy, wheat, cotton, pulses) and organic amendments.',
        keyConcepts: ['Basal vs top-dressing', 'FYM / Vermicompost dosing', 'Urea-DAP-MOP reduction']
      },
      {
        id: '5.3',
        title: 'Organic Carbon & Humus Restoration',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Building soil organic matter from <0.5% to >1.0% through green manuring and biochar.',
        keyConcepts: ['Organic carbon %', 'Green manuring (Dhaincha)', 'Humus restoration']
      },
      {
        id: '5.4',
        title: 'Economic ROI & Input Optimization',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Quantifying farmer cost reductions and yield gains from scientific balanced fertilization.',
        keyConcepts: ['Cost-benefit ratio', 'Yield response curve', 'Input cost savings']
      }
    ]
  },
  {
    id: 6,
    code: 'MOD-06',
    title: 'Community Outreach, Farmer Advisory & Capstone Impact',
    subtitle: 'Empowering rural communities through empathetic scientific dialogue',
    allocatedHours: 12,
    image: '/assets/images/farmer-outreach.png',
    description: 'Conducting farmer advisory consultations, role-playing vernacular discussions, organizing village soil campaigns, and presenting the capstone innovation project.',
    assessmentType: 'Quiz + Capstone',
    theorySummary: 'The ultimate measure of the School Innovation Lab is community transformation. Students work in cohorts of 4 to reach 50+ local farmers, presenting Soil Health Cards in simple vernacular language and leading community soil health campaigns.',
    learningOutcomes: [
      'Communicate complex agronomic findings in clear, friendly local vernacular language.',
      'Overcome traditional skepticism and guide farmers on practical sustainable soil stewardship.',
      'Organize school-led village soil campaigns and deliver a group capstone project.'
    ],
    handsOnLabActivities: [
      'Role-playing farmer advisory consultations with peers and faculty coordinators.',
      'In-person village field visits to deliver Soil Health Cards to 5+ local farmers.',
      'Group capstone innovation presentation and certification qualification.'
    ],
    topics: [
      {
        id: '6.1',
        title: 'Farmer Advisory Communication & Vernacular Dialogue',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Role-playing consultations, explaining Soil Health Cards in simple language, overcoming traditional hesitation.',
        keyConcepts: ['Empathetic listening', 'Vernacular terminology', 'Economic ROI explanation']
      },
      {
        id: '6.2',
        title: 'Community Soil Awareness Campaigns',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Organizing village gatherings, street-corner soil demos, group capstone presentation.',
        keyConcepts: ['Village panchayat outreach', 'Campaign documentation', 'Demonstration plots']
      },
      {
        id: '6.3',
        title: 'Monitoring Field Response & Soil Stewardship',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Tracking post-harvest farmer feedback, soil structure improvement, and crop yield validation.',
        keyConcepts: ['Post-harvest follow-up', 'Soil biological recovery', 'Peer farmer adoption']
      },
      {
        id: '6.4',
        title: 'Capstone Innovation Showcase & Certification',
        theoryHours: 1.5,
        practicalHours: 1.5,
        description: 'Final student team presentation, innovation project submission, and Soil Partner certification.',
        keyConcepts: ['Capstone documentation', 'Innovation jury evaluation', 'Soil Partner certification']
      }
    ]
  }
];

export interface JourneyStep {
  step: number;
  id: string;
  pptStage: string;
  title: string;
  tagline: string;
  iconName: string;
  image: string;
  description: string;
  completedIconColor: string;
}

export const SOIL_JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    id: 'collect',
    pptStage: '01 COLLECT',
    title: 'Field Soil Sampling',
    tagline: 'Zig-zag 15cm V-cut in field',
    iconName: 'Compass',
    image: '/assets/images/poster-how-to-collect.png',
    description: 'Walk in zig-zag grid, dig 15cm V-hole, take clean core slices.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 2,
    id: 'prepare',
    pptStage: '02 PREPARE',
    title: 'Clean, Dry & Sieve',
    tagline: 'Shade drying & 2mm sieve',
    iconName: 'Filter',
    image: '/assets/images/student-lab-discovery.png',
    description: 'Air-dry in shade, crush clods, remove debris, pass 2mm mesh.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 3,
    id: 'test',
    pptStage: '03 TEST',
    title: 'SoiLENZ Sensor Dip',
    tagline: 'Optical multi-sensor scan',
    iconName: 'Cpu',
    image: '/assets/images/poster-soilenz-testing.png',
    description: 'Mix soil extract and dip SoiLENZ sensors for instant scan.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 4,
    id: 'record',
    pptStage: '04 RECORD',
    title: 'Digital Cloud Telemetry',
    tagline: 'GPS plot & farmer ID sync',
    iconName: 'Database',
    image: '/assets/images/module-sample-collection.png',
    description: 'Log sample ID, crop type, GPS location, and raw test readings.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 5,
    id: 'analyze',
    pptStage: '05 ANALYZE',
    title: 'N-P-K & pH Parameter Scan',
    tagline: 'Chemistry & macro nutrients',
    iconName: 'BarChart3',
    image: '/assets/images/poster-why-test-soil.png',
    description: 'Check pH acidity, salinity (EC), organic carbon, and N-P-K.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 6,
    id: 'interpret',
    pptStage: '06 INTERPRET',
    title: 'Diagnose Deficiencies',
    tagline: 'Benchmark agricultural limits',
    iconName: 'Activity',
    image: '/assets/images/poster-reading-report.png',
    description: 'Identify nutrient gaps and soil health bottlenecks.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 7,
    id: 'report',
    pptStage: '07 REPORT',
    title: 'Soil Health Card',
    tagline: 'Personalized fertilizer card',
    iconName: 'FileCheck',
    image: '/assets/images/module-health-reports.png',
    description: 'Generate Arkashine card with customized organic & fertilizer plan.',
    completedIconColor: 'bg-emerald-600 text-white'
  },
  {
    step: 8,
    id: 'apply',
    pptStage: '08 APPLY',
    title: 'Farmer Outreach Visit',
    tagline: 'Empowering local farmers',
    iconName: 'Leaf',
    image: '/assets/images/farmer-outreach.png',
    description: 'Present report to farmer to optimize crop harvest and soil.',
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
