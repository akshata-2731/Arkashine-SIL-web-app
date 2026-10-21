import { AuditLog } from '../../types';

export function generateAuditLogs(): AuditLog[] {
  const now = Date.now();
  return [
    {
      id: 'AUD-01',
      timestamp: new Date(now - 3600000 * 2).toISOString(),
      actorName: 'Dr. Sunita Deshmukh',
      actorRole: 'partner',
      action: 'ELIGIBILITY_APPROVED',
      details: 'Approved Pragati Public School (SCH-04) eligibility with condition: sensor calibration.',
      schoolId: 'SCH-04'
    },
    {
      id: 'AUD-02',
      timestamp: new Date(now - 3600000 * 18).toISOString(),
      actorName: 'Dr. Anjali Patil',
      actorRole: 'faculty',
      action: 'DAILY_LOG_SUBMITTED',
      details: 'Submitted Day 20 daily update (SoiLENZ Cross-validation, 14 samples tested).',
      schoolId: 'SCH-01'
    },
    {
      id: 'AUD-03',
      timestamp: new Date(now - 86400000 * 2).toISOString(),
      actorName: 'Arkashine Super Admin',
      actorRole: 'arkashine',
      action: 'CERTIFICATE_ISSUED',
      details: 'Issued official "Soil Partner" certificates to 6 validated students of SCH-01.',
      schoolId: 'SCH-01'
    },
    {
      id: 'AUD-04',
      timestamp: new Date(now - 86400000 * 3).toISOString(),
      actorName: 'Fr. Thomas Matthew',
      actorRole: 'principal',
      action: 'PRINCIPAL_REMARK_ADDED',
      details: 'Endorsed Week 3 daily log and approved student outreach field itinerary.',
      schoolId: 'SCH-01'
    }
  ];
}
