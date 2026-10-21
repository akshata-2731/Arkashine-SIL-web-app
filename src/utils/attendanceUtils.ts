export type AttendanceStatus = 'present' | 'late' | 'absent';

/**
 * Rotates student attendance status in order: present -> late -> absent -> present
 */
export function getNextAttendanceStatus(current?: AttendanceStatus | string): AttendanceStatus {
  const status = current || 'present';
  if (status === 'present') return 'late';
  if (status === 'late') return 'absent';
  return 'present';
}
