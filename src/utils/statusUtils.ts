export interface ComputeLogStatusParams {
  submissionTime?: string | Date;
  expectedDate?: string; // YYYY-MM-DD
  dayNumber: number;
  schoolCurrentDay: number;
  hoursTaught: number;
  plannedHours?: number;
  isDelayed?: boolean;
}

/**
 * Computes the status of a daily log based on submission time,
 * hours taught vs planned hours, and session date.
 */
export function computeDailyLogStatus(params: ComputeLogStatusParams): 'On_Time' | 'Late' | 'Partial' {
  const planned = params.plannedHours ?? 2.5;

  // If hours taught is less than planned hours, it's a Partial session
  if (params.hoursTaught < planned) {
    return 'Partial';
  }

  // If explicitly flagged as delayed by the coordinator
  if (params.isDelayed) {
    return 'Late';
  }

  // If submitting a log for an earlier day than the school's current progression day
  if (params.dayNumber < params.schoolCurrentDay) {
    return 'Late';
  }

  const subDate = params.submissionTime ? new Date(params.submissionTime) : new Date();

  // If an expected date was specified and the submission date is past it
  if (params.expectedDate) {
    const subDateStr = subDate.toISOString().split('T')[0];
    if (subDateStr > params.expectedDate) {
      return 'Late';
    }
  }

  // If submitted after 19:00 (7 PM) on the day of the session
  if (subDate.getHours() >= 19) {
    return 'Late';
  }

  return 'On_Time';
}
