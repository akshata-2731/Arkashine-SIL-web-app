import { SoilSample } from '../../types';

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
        date: new Date(Date.now() - ((i % 16) * 86400000)).toISOString().split('T')[0],
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
