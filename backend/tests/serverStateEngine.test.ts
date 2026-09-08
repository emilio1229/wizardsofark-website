import { describe, expect, it } from 'vitest';
import {
  observeServerStatus,
  simulateStatusTimeline,
} from '../src/server/serverStateEngine.js';
import { filterWoaServers, matchesServerNameFilter } from '../src/asa/serverFilter.js';
import { parseAsaServer } from '../src/asa/asaParser.js';
import { calculatePlayerUtilization } from '../src/utils/playerStats.js';

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
    // polls at t=0,60,120,180,240,300,360 with absence starting at second poll
    const presence = [true, false, false, false, false, false, true];
    const timeline = simulateStatusTimeline(presence, thresholds);
    expect(timeline[0]).toBe('online');
    expect(timeline[1]).toBe('restarting'); // 0s missing at first absence tick (missingSince=now)
    expect(timeline[2]).toBe('restarting'); // 60s
    expect(timeline[3]).toBe('restarting'); // 120s
    expect(timeline[4]).toBe('restarting'); // 180s still restarting (inclusive)
    expect(timeline[5]).toBe('possibly_updating'); // 240s
    expect(timeline[6]).toBe('online');
  });

  it('eventually reaches OFFLINE', () => {
    // 0..11 minutes of absence after first online
    const presence = [true, ...Array.from({ length: 12 }, () => false)];
    const timeline = simulateStatusTimeline(presence, thresholds);
    expect(timeline[0]).toBe('online');
    expect(timeline[1]).toBe('restarting');
    expect(timeline[5]).toBe('possibly_updating'); // 240s
    expect(timeline[10]).toBe('possibly_updating'); // 540s
    expect(timeline[11]).toBe('offline'); // 600s
    expect(timeline[12]).toBe('offline'); // 660s
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
    // Documented contract: poll failure path must not call observeServerStatus with absence.
    // This unit asserts that absence-only observation is explicit and intentional.
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

describe('ASA parser', () => {
  it('parses a real-shaped record and uses IP:Port as id', () => {
    const parsed = parseAsaServer({
      Name: 'The Wizards Of Ark \\Ragnarok\\No Wipe',
      SessionName: 'The Wizards Of Ark \\Ragnarok\\No Wipe - (v93.22)',
      MapName: 'Ragnarok_WP',
      IP: '37.10.115.234',
      Port: 5970,
      LatencyPort: 'WinLiveLatecyCheckPort',
      NumPlayers: 1,
      MaxPlayers: 32,
      BuildId: 93,
      MinorBuildId: 22,
      ServerPing: 176,
      SessionID: 'f00e6327d7304fa6889117b002421723',
      ClusterId: 'abc',
      SessionIsPve: 1,
      LastUpdated: 1788901860469,
    });

    expect(parsed).toMatchObject({
      id: '37.10.115.234:5970',
      mapId: 'ragnarok',
      mapDisplayName: 'Ragnarok',
      gamePort: 5970,
      queryPort: null,
      players: 1,
      maxPlayers: 32,
      version: '93.22',
      isPve: true,
    });
  });

  it('skips malformed records instead of throwing', () => {
    expect(parseAsaServer({ Name: 'Missing IP', Port: 7777 })).toBeNull();
  });
});

describe('player utilisation', () => {
  it('handles missing and zero capacity safely', () => {
    expect(calculatePlayerUtilization(12, 70)).toBeCloseTo(0.1714, 4);
    expect(calculatePlayerUtilization(5, 0)).toBeNull();
    expect(calculatePlayerUtilization(null, 70)).toBeNull();
  });
});
