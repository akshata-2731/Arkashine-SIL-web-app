import { NotificationItem } from '../../types';

export function generateNotifications(): NotificationItem[] {
  const now = Date.now();
  return [
    {
      id: 'NOTIF-01',
      title: 'Eligibility Approval Pending',
      message: 'Navodaya Adarsh Gurukulam (SCH-05) submitted updated Wi-Fi & Safety equipment proof.',
      timestamp: new Date(now - 3600000 * 3).toISOString(),
      read: false,
      type: 'info',
      roleScope: ['arkashine', 'partner'],
      schoolId: 'SCH-05'
    },
    {
      id: 'NOTIF-02',
      title: 'Missed Daily Log Alert',
      message: 'Vidyasagar Krishi Vidyapeeth has 2 consecutive missing daily logs on Days 12 & 13.',
      timestamp: new Date(now - 86400000 * 6).toISOString(),
      read: false,
      type: 'alert',
      roleScope: ['arkashine', 'partner', 'principal'],
      schoolId: 'SCH-02'
    },
    {
      id: 'NOTIF-03',
      title: 'Certificates Ready for Review',
      message: '12 students at St. Xavier’s have met all completion criteria and are ready for Arkashine issuance.',
      timestamp: new Date(now - 86400000 * 1).toISOString(),
      read: false,
      type: 'success',
      roleScope: ['arkashine', 'partner', 'principal'],
      schoolId: 'SCH-01'
    }
  ];
}
