import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  LiveServer,
  MasterListStatus,
  ServersNetworkResponse,
  ServerStatus,
} from '@woa/shared';
import type { AppConfiguration } from '../config/configuration';
import { PrismaService } from '../database/prisma.service';
import { CACHE_STORE, type CacheStore } from '../redis/cache-store.interface';
import {
  observeServerStatus,
  shouldRecordTransition,
} from './engines/server-state.engine';
import { AsaUnofficialListProvider } from './providers/asa-unofficial-list.provider';
import type {
  KnownServerRecord,
  MeaningfulServerChange,
  ParsedAsaServer,
  PollHealth,
  StatusTransitionRecord,
} from './types';
import { compareServersByMapOrder } from './utils/ordering';
import {
  calculatePlayerUtilization,
  summarisePlayers,
} from './utils/player-stats';

const SERVERS_CACHE_KEY = 'servers:network-payload';

export type PollOnceResult = {
  ok: boolean;
  matched: number;
  skipped: number;
  error?: string;
  changes: MeaningfulServerChange[];
};

@Injectable()
export class ServersService {
  private readonly logger = new Logger(ServersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly asaProvider: AsaUnofficialListProvider,
    @Optional() @Inject(CACHE_STORE) private readonly cacheStore?: CacheStore,
  ) {}

  private get config(): AppConfiguration {
    return {
      nodeEnv: this.configService.get<string>('nodeEnv', 'development'),
      port: this.configService.get<number>('port', 3001),
      host: this.configService.get<string>('host', '0.0.0.0'),
      databaseUrl: this.configService.get<string>('databaseUrl', ''),
      frontendUrl: this.configService.get<string>('frontendUrl', ''),
      corsOrigin: this.configService.get<string>('corsOrigin', '*'),
      arkApiUrl: this.configService.get<string>('arkApiUrl', ''),
      serverNameFilter: this.configService.get<string>(
        'serverNameFilter',
        'The Wizards Of Ark',
      ),
      arkServerPollIntervalMs: this.configService.get<number>(
        'arkServerPollIntervalMs',
        60_000,
      ),
      restartingThresholdSeconds: this.configService.get<number>(
        'restartingThresholdSeconds',
        180,
      ),
      offlineThresholdSeconds: this.configService.get<number>(
        'offlineThresholdSeconds',
        600,
      ),
      cacheTtlSeconds: this.configService.get<number>('cacheTtlSeconds', 45),
      asaFetchTimeoutMs: this.configService.get<number>('asaFetchTimeoutMs', 30_000),
      masterListStaleSeconds: this.configService.get<number>(
        'masterListStaleSeconds',
        180,
      ),
      mapOrder: this.configService.get<string[]>('mapOrder', []),
      redisUrl: this.configService.get<string | null>('redisUrl', null),
    };
  }

  async pollOnce(now = new Date()): Promise<PollOnceResult> {
    try {
      const { servers: matched, skipped } = await this.asaProvider.fetchWithStats();
      const changes = await this.applySuccessfulPoll(matched, now);
      await this.setPollSuccess(now);
      await this.invalidateCache();
      return { ok: true, matched: matched.length, skipped, changes };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown ASA poll failure';
      const health = await this.getPollHealth();
      await this.setPollFailure(now, message, health.consecutiveFailures + 1);
      // Critical: do not mutate per-server statuses on master-list failure.
      await this.invalidateCache();
      this.logger.error(`ASA poll failed; retaining prior server states: ${message}`);
      return { ok: false, matched: 0, skipped: 0, error: message, changes: [] };
    }
  }

  async getServersPayload(now = new Date()): Promise<ServersNetworkResponse> {
    const ttl = this.config.cacheTtlSeconds;
    if (this.cacheStore && ttl > 0) {
      const cached = await this.cacheStore.get<ServersNetworkResponse>(SERVERS_CACHE_KEY);
      if (cached) {
        return cached;
      }
    }

    const payload = await this.buildPayload(now);
    if (this.cacheStore && ttl > 0) {
      await this.cacheStore.set(SERVERS_CACHE_KEY, payload, ttl);
    }
    return payload;
  }

  async getServerById(id: string, now = new Date()): Promise<LiveServer | null> {
    const payload = await this.getServersPayload(now);
    return payload.servers.find((server) => server.id === id) ?? null;
  }

  async getServerStatus(id: string, now = new Date()) {
    const server = await this.getServerById(id, now);
    if (!server) {
      return null;
    }
    return {
      id: server.id,
      status: server.status,
      players: server.players,
      maxPlayers: server.maxPlayers,
      lastChecked: server.lastChecked,
      lastSeen: server.lastSeen,
      missingSince: server.missingSince,
      statusExplanation: statusExplanation(server.status),
      statusHistory: server.statusHistory,
    };
  }

  private async invalidateCache(): Promise<void> {
    await this.cacheStore?.del(SERVERS_CACHE_KEY);
  }

  private async applySuccessfulPoll(
    liveServers: ParsedAsaServer[],
    now: Date,
  ): Promise<MeaningfulServerChange[]> {
    const known = await this.listServers();
    const liveById = new Map(liveServers.map((server) => [server.id, server]));
    const knownById = new Map(known.map((server) => [server.id, server]));
    const changes: MeaningfulServerChange[] = [];

    for (const live of liveServers) {
      const existing = knownById.get(live.id);
      if (!existing) {
        const change = await this.createServer(live, now);
        changes.push(change);
        continue;
      }
      const change = await this.updateObservedServer(existing, live, true, now);
      if (change) {
        changes.push(change);
      }
    }

    for (const existing of known) {
      if (liveById.has(existing.id)) {
        continue;
      }
      const change = await this.updateObservedServer(existing, null, false, now);
      if (change) {
        changes.push(change);
      }
    }

    return changes;
  }

  private async createServer(
    live: ParsedAsaServer,
    now: Date,
  ): Promise<MeaningfulServerChange> {
    const record: KnownServerRecord = {
      id: live.id,
      sessionId: live.sessionId,
      name: live.name,
      sessionName: live.sessionName,
      mapName: live.mapName,
      mapDisplayName: live.mapDisplayName,
      mapId: live.mapId,
      ip: live.ip,
      gamePort: live.gamePort,
      queryPort: live.queryPort,
      firstSeen: now,
      lastSeen: now,
      lastChecked: now,
      currentStatus: 'online',
      previousStatus: null,
      players: live.players,
      maxPlayers: live.maxPlayers,
      version: live.version,
      ping: live.ping,
      clusterId: live.clusterId,
      isPve: live.isPve,
      missingSince: null,
      createdAt: now,
      updatedAt: now,
    };

    await this.upsertServer(record);
    await this.insertTransition({
      serverId: record.id,
      fromStatus: null,
      toStatus: 'online',
      observedAt: now,
      note: 'Discovered in ASA unofficial server list',
    });
    await this.writeSnapshot(record);

    return {
      serverId: record.id,
      previousStatus: null,
      nextStatus: 'online',
      previousPlayers: null,
      nextPlayers: live.players,
      discovered: true,
    };
  }

  private async updateObservedServer(
    existing: KnownServerRecord,
    live: ParsedAsaServer | null,
    present: boolean,
    now: Date,
  ): Promise<MeaningfulServerChange | null> {
    const observation = observeServerStatus({
      previousStatus: existing.currentStatus,
      missingSince: existing.missingSince,
      presentInLatestSuccessfulPoll: present,
      now,
      thresholds: {
        restartingThresholdSeconds: this.config.restartingThresholdSeconds,
        offlineThresholdSeconds: this.config.offlineThresholdSeconds,
      },
    });

    const nextStatus = observation.status;
    const previousStatus = existing.currentStatus;
    const previousPlayers = existing.players;

    const updated: KnownServerRecord = {
      ...existing,
      lastChecked: now,
      updatedAt: now,
      currentStatus: nextStatus,
      previousStatus: nextStatus !== previousStatus ? previousStatus : existing.previousStatus,
      missingSince: observation.missingSince,
    };

    if (live) {
      updated.sessionId = live.sessionId;
      updated.name = live.name;
      updated.sessionName = live.sessionName;
      updated.mapName = live.mapName;
      updated.mapDisplayName = live.mapDisplayName;
      updated.mapId = live.mapId;
      updated.ip = live.ip;
      updated.gamePort = live.gamePort;
      updated.queryPort = live.queryPort;
      updated.players = live.players;
      updated.maxPlayers = live.maxPlayers;
      updated.version = live.version;
      updated.ping = live.ping;
      updated.clusterId = live.clusterId;
      updated.isPve = live.isPve;
      updated.lastSeen = now;
    }

    await this.upsertServer(updated);

    if (shouldRecordTransition(previousStatus, nextStatus)) {
      await this.insertTransition({
        serverId: existing.id,
        fromStatus: previousStatus,
        toStatus: nextStatus,
        observedAt: now,
        note: present
          ? 'Returned in ASA unofficial server list'
          : 'Absent from latest successful ASA unofficial server list',
      });
    }

    const playersChanged = (updated.players ?? null) !== (previousPlayers ?? null);
    const statusChanged = nextStatus !== previousStatus;

    if (!statusChanged && !playersChanged) {
      return null;
    }

    if (statusChanged || playersChanged) {
      await this.writeSnapshot(updated);
    }

    return {
      serverId: existing.id,
      previousStatus,
      nextStatus,
      previousPlayers,
      nextPlayers: updated.players,
      discovered: false,
    };
  }

  private async buildPayload(now: Date): Promise<ServersNetworkResponse> {
    const health = await this.getPollHealth();
    const masterListStatus = this.resolveMasterListStatus(health.lastSuccessfulPollAt, now);
    const known = (await this.listServers()).sort((a, b) =>
      compareServersByMapOrder(a, b, this.config.mapOrder),
    );
    const historyByServer = await this.listTransitionsForServers(
      known.map((server) => server.id),
    );

    const apiServers: LiveServer[] = known.map((server) =>
      this.toApiServer(server, historyByServer),
    );
    const playerTotals = summarisePlayers(
      apiServers.map((server) => ({
        players: server.players,
        maxPlayers: server.maxPlayers,
        status: server.status,
      })),
    );

    const summary = {
      totalServers: apiServers.length,
      online: apiServers.filter((server) => server.status === 'online').length,
      restarting: apiServers.filter((server) => server.status === 'restarting').length,
      possiblyUpdating: apiServers.filter((server) => server.status === 'possibly_updating')
        .length,
      offline: apiServers.filter((server) => server.status === 'offline').length,
      currentPlayers: playerTotals.currentPlayers,
      maxPlayers: playerTotals.maxPlayers,
    };

    return {
      network: this.config.serverNameFilter,
      lastUpdated: health.lastAttemptAt?.toISOString() ?? null,
      lastSuccessfulPoll: health.lastSuccessfulPollAt?.toISOString() ?? null,
      masterListStatus,
      dataStale: masterListStatus !== 'healthy',
      summary,
      servers: apiServers,
    };
  }

  private toApiServer(
    server: KnownServerRecord,
    historyByServer: Map<string, StatusTransitionRecord[]>,
  ): LiveServer {
    const history = historyByServer.get(server.id) ?? [];
    return {
      id: server.id,
      name: server.name,
      map: server.mapDisplayName,
      mapId: server.mapId,
      mapName: server.mapName,
      ip: server.ip,
      gamePort: server.gamePort,
      queryPort: server.queryPort,
      players: server.players,
      maxPlayers: server.maxPlayers,
      playerUtilization: calculatePlayerUtilization(server.players, server.maxPlayers),
      status: server.currentStatus,
      version: server.version,
      ping: server.ping,
      clusterId: server.clusterId,
      isPve: server.isPve,
      firstSeen: server.firstSeen.toISOString(),
      lastSeen: server.lastSeen?.toISOString() ?? null,
      lastChecked: server.lastChecked.toISOString(),
      missingSince: server.missingSince?.toISOString() ?? null,
      statusHistory: history.map((entry) => ({
        fromStatus: entry.fromStatus,
        toStatus: entry.toStatus,
        observedAt: entry.observedAt.toISOString(),
        note: entry.note,
      })),
    };
  }

  private resolveMasterListStatus(
    lastSuccessfulPollAt: Date | null,
    now: Date,
  ): MasterListStatus {
    if (!lastSuccessfulPollAt) {
      return 'unavailable';
    }

    const ageSeconds = (now.getTime() - lastSuccessfulPollAt.getTime()) / 1000;
    if (ageSeconds <= this.config.masterListStaleSeconds) {
      return 'healthy';
    }
    if (ageSeconds <= this.config.masterListStaleSeconds * 5) {
      return 'stale';
    }
    return 'unavailable';
  }

  private mapServerRow(row: {
    id: string;
    sessionId: string | null;
    name: string;
    sessionName: string | null;
    mapName: string | null;
    mapDisplayName: string;
    mapId: string;
    ip: string;
    gamePort: number;
    queryPort: number | null;
    firstSeen: Date;
    lastSeen: Date | null;
    lastChecked: Date;
    currentStatus: string;
    previousStatus: string | null;
    players: number | null;
    maxPlayers: number | null;
    version: string | null;
    ping: number | null;
    clusterId: string | null;
    isPve: boolean | null;
    missingSince: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): KnownServerRecord {
    return {
      id: row.id,
      sessionId: row.sessionId,
      name: row.name,
      sessionName: row.sessionName,
      mapName: row.mapName,
      mapDisplayName: row.mapDisplayName,
      mapId: row.mapId,
      ip: row.ip,
      gamePort: row.gamePort,
      queryPort: row.queryPort,
      firstSeen: row.firstSeen,
      lastSeen: row.lastSeen,
      lastChecked: row.lastChecked,
      currentStatus: row.currentStatus as ServerStatus,
      previousStatus: (row.previousStatus as ServerStatus | null) ?? null,
      players: row.players,
      maxPlayers: row.maxPlayers,
      version: row.version,
      ping: row.ping,
      clusterId: row.clusterId,
      isPve: row.isPve,
      missingSince: row.missingSince,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private async listServers(): Promise<KnownServerRecord[]> {
    const rows = await this.prisma.arkServer.findMany();
    return rows.map((row) => this.mapServerRow(row));
  }

  private async upsertServer(record: KnownServerRecord): Promise<void> {
    await this.prisma.arkServer.upsert({
      where: { id: record.id },
      create: {
        id: record.id,
        sessionId: record.sessionId,
        name: record.name,
        sessionName: record.sessionName,
        mapName: record.mapName,
        mapDisplayName: record.mapDisplayName,
        mapId: record.mapId,
        ip: record.ip,
        gamePort: record.gamePort,
        queryPort: record.queryPort,
        firstSeen: record.firstSeen,
        lastSeen: record.lastSeen,
        lastChecked: record.lastChecked,
        currentStatus: record.currentStatus,
        previousStatus: record.previousStatus,
        players: record.players,
        maxPlayers: record.maxPlayers,
        version: record.version,
        ping: record.ping,
        clusterId: record.clusterId,
        isPve: record.isPve,
        missingSince: record.missingSince,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      update: {
        sessionId: record.sessionId,
        name: record.name,
        sessionName: record.sessionName,
        mapName: record.mapName,
        mapDisplayName: record.mapDisplayName,
        mapId: record.mapId,
        ip: record.ip,
        gamePort: record.gamePort,
        queryPort: record.queryPort,
        firstSeen: record.firstSeen,
        lastSeen: record.lastSeen,
        lastChecked: record.lastChecked,
        currentStatus: record.currentStatus,
        previousStatus: record.previousStatus,
        players: record.players,
        maxPlayers: record.maxPlayers,
        version: record.version,
        ping: record.ping,
        clusterId: record.clusterId,
        isPve: record.isPve,
        missingSince: record.missingSince,
        updatedAt: record.updatedAt,
      },
    });
  }

  private async insertTransition(input: {
    serverId: string;
    fromStatus: ServerStatus | null;
    toStatus: ServerStatus;
    observedAt: Date;
    note?: string | null;
  }): Promise<void> {
    await this.prisma.statusTransition.create({
      data: {
        serverId: input.serverId,
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
        observedAt: input.observedAt,
        note: input.note ?? null,
      },
    });
  }

  private async listTransitionsForServers(
    serverIds: string[],
    limitPerServer = 12,
  ): Promise<Map<string, StatusTransitionRecord[]>> {
    const result = new Map<string, StatusTransitionRecord[]>();
    if (serverIds.length === 0) {
      return result;
    }

    const rows = await this.prisma.statusTransition.findMany({
      where: { serverId: { in: serverIds } },
      orderBy: [{ observedAt: 'desc' }, { id: 'desc' }],
    });

    for (const row of rows) {
      const list = result.get(row.serverId) ?? [];
      if (list.length >= limitPerServer) {
        continue;
      }
      list.push({
        id: row.id,
        serverId: row.serverId,
        fromStatus: (row.fromStatus as ServerStatus | null) ?? null,
        toStatus: row.toStatus as ServerStatus,
        observedAt: row.observedAt,
        note: row.note,
      });
      result.set(row.serverId, list);
    }

    return result;
  }

  private async writeSnapshot(server: KnownServerRecord): Promise<void> {
    await this.prisma.serverSnapshot.create({
      data: {
        serverId: server.id,
        players: server.players,
        maxPlayers: server.maxPlayers,
        status: server.currentStatus,
        capturedAt: server.lastChecked,
      },
    });
  }

  private async getPollHealth(): Promise<PollHealth> {
    const keys = [
      'last_attempt_at',
      'last_successful_poll_at',
      'last_error',
      'consecutive_failures',
    ];
    const rows = await this.prisma.pollMeta.findMany({
      where: { key: { in: keys } },
    });
    const map = new Map(rows.map((row) => [row.key, row.value]));

    return {
      lastAttemptAt: fromIso(map.get('last_attempt_at')),
      lastSuccessfulPollAt: fromIso(map.get('last_successful_poll_at')),
      lastError: map.get('last_error') || null,
      consecutiveFailures: map.get('consecutive_failures')
        ? Number(map.get('consecutive_failures')) || 0
        : 0,
    };
  }

  private async setPollSuccess(at: Date): Promise<void> {
    await this.setMeta('last_attempt_at', at.toISOString());
    await this.setMeta('last_successful_poll_at', at.toISOString());
    await this.setMeta('last_error', '');
    await this.setMeta('consecutive_failures', '0');
  }

  private async setPollFailure(
    at: Date,
    errorMessage: string,
    consecutiveFailures: number,
  ): Promise<void> {
    await this.setMeta('last_attempt_at', at.toISOString());
    await this.setMeta('last_error', errorMessage.slice(0, 500));
    await this.setMeta('consecutive_failures', String(consecutiveFailures));
  }

  private async setMeta(key: string, value: string): Promise<void> {
    await this.prisma.pollMeta.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
}

export function statusExplanation(status: ServerStatus): string | null {
  if (status === 'possibly_updating') {
    return 'Server has not appeared in the public ASA server list for several minutes. This may indicate a restart, update, crash or network issue.';
  }
  if (status === 'restarting') {
    return 'Server was recently online but is temporarily absent from the public ASA server list. This often indicates a short interruption such as a restart.';
  }
  if (status === 'offline') {
    return 'Server has been absent from the public ASA server list beyond the offline threshold. Live presence cannot be confirmed.';
  }
  return null;
}

function fromIso(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
