import type { ServerStatus } from '../types';

export type StatusEngineThresholds = {
  restartingThresholdSeconds: number;
  offlineThresholdSeconds: number;
};

export type StatusObservationInput = {
  previousStatus: ServerStatus;
  missingSince: Date | null;
  presentInLatestSuccessfulPoll: boolean;
  now: Date;
  thresholds: StatusEngineThresholds;
};

export type StatusObservationResult = {
  status: ServerStatus;
  missingSince: Date | null;
};

/**
 * Observation-based status detection.
 * Never invents confirmed restart/update/crash reasons — only absences from a successful ASA list.
 */
export function observeServerStatus(input: StatusObservationInput): StatusObservationResult {
  const { previousStatus, presentInLatestSuccessfulPoll, now, thresholds } = input;
  void previousStatus;

  if (presentInLatestSuccessfulPoll) {
    return {
      status: 'online',
      missingSince: null,
    };
  }

  const missingSince = input.missingSince ?? now;
  const missingSeconds = Math.max(0, (now.getTime() - missingSince.getTime()) / 1000);

  if (missingSeconds <= thresholds.restartingThresholdSeconds) {
    return {
      status: 'restarting',
      missingSince,
    };
  }

  if (missingSeconds < thresholds.offlineThresholdSeconds) {
    return {
      status: 'possibly_updating',
      missingSince,
    };
  }

  return {
    status: 'offline',
    missingSince,
  };
}

export function shouldRecordTransition(
  previousStatus: ServerStatus | null,
  nextStatus: ServerStatus,
): boolean {
  return previousStatus !== nextStatus;
}

/** Pure helper for tests: simulate a sequence of presence observations. */
export function simulateStatusTimeline(
  presenceByPoll: boolean[],
  thresholds: StatusEngineThresholds,
  start: Date = new Date('2026-09-08T20:00:00Z'),
  pollIntervalSeconds = 60,
): ServerStatus[] {
  let status: ServerStatus = 'online';
  let missingSince: Date | null = null;
  const timeline: ServerStatus[] = [];

  for (let index = 0; index < presenceByPoll.length; index += 1) {
    const now = new Date(start.getTime() + index * pollIntervalSeconds * 1000);
    const result = observeServerStatus({
      previousStatus: status,
      missingSince,
      presentInLatestSuccessfulPoll: presenceByPoll[index]!,
      now,
      thresholds,
    });
    status = result.status;
    missingSince = result.missingSince;
    timeline.push(status);
  }

  return timeline;
}
