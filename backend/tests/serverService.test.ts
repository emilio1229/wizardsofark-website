import { describe, expect, it } from 'vitest';
import { ServerService } from '../src/server/serverService.js';
import type { AppConfig } from '../src/config/env.js';
import type { ServerRepository } from '../src/server/serverRepository.js';
import type { KnownServerRecord, ParsedAsaServer, PollHealth } from '../src/server/types.js';

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    port: 3001,
    host: '127.0.0.1',
    asaServerListUrl: 'https://example.test/list.json',
    serverNameFilter: 'The Wizards Of Ark',
    pollIntervalSeconds: 60,
    restartingThresholdSeconds: 180,
    offlineThresholdSeconds: 600,
    cacheTtlSeconds: 0,
    asaFetchTimeoutMs: 1000,
    masterListStaleSeconds: 180,
    databasePath: ':memory:',
    staticDir: null,
    corsOrigin: '*',
    mapOrder: ['The Island', 'Ragnarok'],
    ...overrides,
  };
}

function makeLive(partial: Partial<ParsedAsaServer> = {}): ParsedAsaServer {
  return {
    id: '1.2.3.4:7777',
    sessionId: 'abc',
    name: 'The Wizards Of Ark - Ragnarok',
    sessionName: 'The Wizards Of Ark - Ragnarok - (v93.22)',
    mapName: 'Ragnarok_WP',
    mapDisplayName: 'Ragnarok',
    mapId: 'ragnarok',
    ip: '1.2.3.4',
    gamePort: 7777,
    queryPort: null,
    players: 12,
    maxPlayers: 70,
    version: '93.22',
    ping: 40,
    clusterId: 'cluster',
    isPve: true,
    asaLastUpdated: null,
    ...partial,
  };
}

function makeKnown(partial: Partial<KnownServerRecord> = {}): KnownServerRecord {
  const now = new Date('2026-09-08T20:00:00Z');
  return {
    id: '1.2.3.4:7777',
    sessionId: 'abc',
    name: 'The Wizards Of Ark - Ragnarok',
    sessionName: 'The Wizards Of Ark - Ragnarok - (v93.22)',
    mapName: 'Ragnarok_WP',
    mapDisplayName: 'Ragnarok',
    mapId: 'ragnarok',
    ip: '1.2.3.4',
    gamePort: 7777,
    queryPort: null,
    firstSeen: now,
    lastSeen: now,
    lastChecked: now,
    currentStatus: 'online',
    previousStatus: null,
    players: 12,
    maxPlayers: 70,
    version: '93.22',
    ping: 40,
    clusterId: 'cluster',
    isPve: true,
    missingSince: null,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

class MemoryRepository implements Pick<
  ServerRepository,
  | 'listServers'
  | 'upsertServer'
  | 'insertTransition'
  | 'listTransitionsForServers'
  | 'getPollHealth'
  | 'setPollSuccess'
  | 'setPollFailure'
> {
  servers = new Map<string, KnownServerRecord>();
  transitions: Array<{
    serverId: string;
    fromStatus: KnownServerRecord['currentStatus'] | null;
    toStatus: KnownServerRecord['currentStatus'];
  }> = [];
  health: PollHealth = {
    lastAttemptAt: null,
    lastSuccessfulPollAt: null,
    lastError: null,
    consecutiveFailures: 0,
  };

  listServers() {
    return [...this.servers.values()];
  }

  upsertServer(record: KnownServerRecord) {
    this.servers.set(record.id, structuredClone(record));
  }

  insertTransition(input: {
    serverId: string;
    fromStatus: KnownServerRecord['currentStatus'] | null;
    toStatus: KnownServerRecord['currentStatus'];
  }) {
    this.transitions.push(input);
  }

  listTransitionsForServers() {
    return new Map();
  }

  getPollHealth() {
    return this.health;
  }

  setPollSuccess(at: Date) {
    this.health = {
      lastAttemptAt: at,
      lastSuccessfulPollAt: at,
      lastError: null,
      consecutiveFailures: 0,
    };
  }

  setPollFailure(at: Date, errorMessage: string, consecutiveFailures: number) {
    this.health = {
      ...this.health,
      lastAttemptAt: at,
      lastError: errorMessage,
      consecutiveFailures,
    };
  }
}

describe('ServerService integration behaviours', () => {
  it('auto-registers a newly discovered matching server', async () => {
    const repo = new MemoryRepository();
    const service = new ServerService(makeConfig(), repo as unknown as ServerRepository);

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify([
          {
            Name: 'The Wizards Of Ark - Ragnarok',
            SessionName: 'The Wizards Of Ark - Ragnarok - (v93.22)',
            MapName: 'Ragnarok_WP',
            IP: '1.2.3.4',
            Port: 7777,
            NumPlayers: 3,
            MaxPlayers: 70,
            BuildId: 93,
            MinorBuildId: 22,
            SessionID: 'abc',
            SessionIsPve: 1,
          },
        ]),
        { status: 200 },
      )) as typeof fetch;

    try {
      const result = await service.pollOnce(new Date('2026-09-08T20:00:00Z'));
      expect(result.ok).toBe(true);
      expect(repo.servers.size).toBe(1);
      expect(repo.servers.get('1.2.3.4:7777')?.currentStatus).toBe('online');
      expect(repo.transitions[0]?.toStatus).toBe('online');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('retains previous server state when the ASA master list fails', async () => {
    const repo = new MemoryRepository();
    repo.upsertServer(makeKnown({ currentStatus: 'online', players: 12 }));
    const service = new ServerService(makeConfig(), repo as unknown as ServerRepository);

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error('DNS failure');
    }) as typeof fetch;

    try {
      const result = await service.pollOnce(new Date('2026-09-08T20:05:00Z'));
      expect(result.ok).toBe(false);
      expect(repo.servers.get('1.2.3.4:7777')?.currentStatus).toBe('online');
      expect(repo.servers.get('1.2.3.4:7777')?.players).toBe(12);
      expect(repo.transitions).toHaveLength(0);
      expect(repo.health.consecutiveFailures).toBe(1);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('marks a missing server restarting on a successful poll without inventing offline', async () => {
    const repo = new MemoryRepository();
    repo.upsertServer(makeKnown({ currentStatus: 'online' }));
    const service = new ServerService(makeConfig(), repo as unknown as ServerRepository);

    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(JSON.stringify([]), { status: 200 })) as typeof fetch;

    try {
      await service.pollOnce(new Date('2026-09-08T20:01:00Z'));
      expect(repo.servers.get('1.2.3.4:7777')?.currentStatus).toBe('restarting');
      expect(repo.transitions.at(-1)?.toStatus).toBe('restarting');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
