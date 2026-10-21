import { describe, it, expect } from 'vitest';
import { getNextAttendanceStatus } from '../attendanceUtils';

describe('attendanceUtils', () => {
  it('cycles through present -> late -> absent -> present correctly', () => {
    // Starting with undefined or present
    expect(getNextAttendanceStatus(undefined)).toBe('late');
    expect(getNextAttendanceStatus('present')).toBe('late');
    expect(getNextAttendanceStatus('late')).toBe('absent');
    expect(getNextAttendanceStatus('absent')).toBe('present');
  });

  it('cycles multiple times in a predictable loop', () => {
    let state = 'present';
    state = getNextAttendanceStatus(state);
    expect(state).toBe('late');
    state = getNextAttendanceStatus(state);
    expect(state).toBe('absent');
    state = getNextAttendanceStatus(state);
    expect(state).toBe('present');
  });
});
