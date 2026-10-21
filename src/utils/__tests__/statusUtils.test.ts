import { describe, it, expect } from 'vitest';
import { computeDailyLogStatus } from '../statusUtils';

describe('computeDailyLogStatus', () => {
  it('returns Partial when hours taught is less than planned hours', () => {
    const status = computeDailyLogStatus({
      hoursTaught: 1.5,
      plannedHours: 2.5,
      dayNumber: 10,
      schoolCurrentDay: 10,
      submissionTime: '2026-06-10T14:00:00Z',
    });
    expect(status).toBe('Partial');
  });

  it('returns Late when isDelayed flag is true', () => {
    const status = computeDailyLogStatus({
      hoursTaught: 2.5,
      plannedHours: 2.5,
      dayNumber: 10,
      schoolCurrentDay: 10,
      isDelayed: true,
      submissionTime: '2026-06-10T14:00:00Z',
    });
    expect(status).toBe('Late');
  });

  it('returns Late when day number is behind the school current progression day', () => {
    const status = computeDailyLogStatus({
      hoursTaught: 2.5,
      plannedHours: 2.5,
      dayNumber: 8,
      schoolCurrentDay: 10,
      submissionTime: '2026-06-10T14:00:00Z',
    });
    expect(status).toBe('Late');
  });

  it('returns Late when submission date exceeds expected date', () => {
    const status = computeDailyLogStatus({
      hoursTaught: 2.5,
      plannedHours: 2.5,
      dayNumber: 10,
      schoolCurrentDay: 10,
      expectedDate: '2026-06-10',
      submissionTime: '2026-06-11T10:00:00Z',
    });
    expect(status).toBe('Late');
  });

  it('returns On_Time when submitted on time with full hours during normal hours', () => {
    // Note: Local time 14:00
    const noonTime = new Date('2026-06-10T12:00:00');
    const status = computeDailyLogStatus({
      hoursTaught: 2.5,
      plannedHours: 2.5,
      dayNumber: 10,
      schoolCurrentDay: 10,
      expectedDate: '2026-06-10',
      submissionTime: noonTime,
    });
    expect(status).toBe('On_Time');
  });
});
