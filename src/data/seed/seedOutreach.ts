import { FarmerOutreach, Campaign } from '../../types';

const farmersNames = ['Ramchandra', 'Vithal', 'Baburao', 'Mukund', 'Sanjay', 'Jagdish', 'Narayandas', 'Kalyanji', 'Haribhau', 'Devraj'];

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
    for (let i = 1; i <= 35; i++) {
      count++;
      const groupNum = (i % 5) + 1;
      list.push({
        id: `OUT-${schoolId}-${String(i).padStart(3, '0')}`,
        schoolId,
        date: new Date(Date.now() - ((i % 18) * 86400000)).toISOString().split('T')[0],
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

export function generateCampaigns(): Campaign[] {
  const now = Date.now();
  return [
    {
      id: 'CMP-01',
      schoolId: 'SCH-01',
      date: new Date(now - 86400000 * 12).toISOString().split('T')[0],
      title: 'Gram Panchayat Soil Health Awareness Drive',
      village: 'Malegaon Budruk',
      attendeesCount: 68,
      topicsCovered: 'Understanding Soil Health Cards, soil sample collection demos, reducing synthetic nitrogen runoff.',
      groupNumber: 1,
      photos: ['/assets/images/farmer-outreach.webp']
    },
    {
      id: 'CMP-02',
      schoolId: 'SCH-01',
      date: new Date(now - 86400000 * 5).toISOString().split('T')[0],
      title: 'Women Farmers Regenerative Agriculture Workshop',
      village: 'Kalyanpur',
      attendeesCount: 84,
      topicsCovered: 'Composting techniques, bio-fertilizer inoculation, vermiculture bedding.',
      groupNumber: 3,
      photos: ['/assets/images/farmer-outreach.webp']
    },
    {
      id: 'CMP-03',
      schoolId: 'SCH-02',
      date: new Date(now - 86400000 * 9).toISOString().split('T')[0],
      title: 'Anand Dairy Catchment Soil Carbon Seminar',
      village: 'Tarapur',
      attendeesCount: 95,
      topicsCovered: 'Fodder crop nutrition, testing cattle paddock soil salinity with SoiLENZ.',
      groupNumber: 2,
      photos: ['/assets/images/farmer-outreach.webp']
    },
    {
      id: 'CMP-04',
      schoolId: 'SCH-03',
      date: new Date(now - 86400000 * 6).toISOString().split('T')[0],
      title: 'Narmada Valley Sustainable Irrigation & Soil Care',
      village: 'Rasulia Farm',
      attendeesCount: 72,
      topicsCovered: 'Waterlogging mitigation, soil compaction relief, balanced potash application.',
      groupNumber: 4,
      photos: ['/assets/images/farmer-outreach.webp']
    }
  ];
}
