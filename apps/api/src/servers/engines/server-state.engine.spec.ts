import {
  observeServerStatus,
  simulateStatusTimeline,
} from './server-state.engine';
import { filterWoaServers, matchesServerNameFilter } from '../providers/server-filter';
import { calculatePlayerUtilization } from '../utils/player-stats';

const thresholds = {
  restartingThresholdSeconds: 180,
  offlineThresholdSeconds: 600,
};

describe('server state engine', () => {
  it('keeps ONLINE when continuously present', () => {
    const timeline = simulateStatusTimeline([true, true, true], thresholds);
    expect(timeline).toEqual(['online', 'online', 'online']);
  });

  it('moves ONLINE → RESTARTING → ONLINE for a short disappearance', () => {
    const timeline = simulateStatusTimeline([true, false, true], thresholds);
    expect(timeline).toEqual(['online', 'restarting', 'online']);
  });

  it('moves through RESTARTING → POSSIBLY_UPDATING → ONLINE', () => {
    const presence = [true, false, false, false, false, false, true];
    const timeline = simulateStatusTimeline(presence, thresholds);
    expect(timeline[0]).toBe('online');
    expect(timeline[1]).toBe('restarting');
    expect(timeline[2]).toBe('restarting');
    expect(timeline[3]).toBe('restarting');
    expect(timeline[4]).toBe('restarting');
    expect(timeline[5]).toBe('possibly_updating');
    expect(timeline[6]).toBe('online');
  });

  it('eventually reaches OFFLINE', () => {
    const presence = [true, ...Array.from({ length: 12 }, () => false)];
    const timeline = simulateStatusTimeline(presence, thresholds);
    expect(timeline[0]).toBe('online');
    expect(timeline[1]).toBe('restarting');
    expect(timeline[5]).toBe('possibly_updating');
    expect(timeline[10]).toBe('possibly_updating');
    expect(timeline[11]).toBe('offline');
    expect(timeline[12]).toBe('offline');
  });

  it('recovers OFFLINE → ONLINE immediately when present again', () => {
    const now = new Date('2026-09-08T20:00:00Z');
    const offline = observeServerStatus({
      previousStatus: 'offline',
      missingSince: new Date(now.getTime() - 900_000),
      presentInLatestSuccessfulPoll: false,
      now,
      thresholds,
    });
    expect(offline.status).toBe('offline');

    const recovered = observeServerStatus({
      previousStatus: 'offline',
      missingSince: offline.missingSince,
      presentInLatestSuccessfulPoll: true,
      now: new Date(now.getTime() + 60_000),
      thresholds,
    });
    expect(recovered).toEqual({ status: 'online', missingSince: null });
  });

  it('does not treat master-list failure as a status transition (caller responsibility)', () => {
    const result = observeServerStatus({
      previousStatus: 'online',
      missingSince: null,
      presentInLatestSuccessfulPoll: true,
      now: new Date(),
      thresholds,
    });
    expect(result.status).toBe('online');
  });
});

describe('server name filter', () => {
  it('matches case-insensitively', () => {
    expect(matchesServerNameFilter('THE WIZARDS OF ARK | The Island', 'The Wizards Of Ark')).toBe(
      true,
    );
    expect(matchesServerNameFilter('Wizards Wonderland', 'The Wizards Of Ark')).toBe(false);
  });

  it('filters collections by name or session name', () => {
    const filtered = filterWoaServers(
      [
        { name: 'The Wizards Of Ark - Ragnarok', sessionName: null },
        { name: 'Other Cluster', sessionName: 'Something else' },
      ],
      'The Wizards Of Ark',
    );
    expect(filtered).toHaveLength(1);
  });
});

describe('player utilisation', () => {
  it('handles missing and zero capacity safely', () => {
    expect(calculatePlayerUtilization(12, 70)).toBeCloseTo(0.1714, 4);
    expect(calculatePlayerUtilization(5, 0)).toBeNull();
    expect(calculatePlayerUtilization(null, 70)).toBeNull();
  });
});
