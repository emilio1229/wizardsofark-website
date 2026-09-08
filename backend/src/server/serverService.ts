import type { AppConfig } from '../config/env.js';
import { fetchAsaUnofficialServerList } from '../asa/asaClient.js';
import { parseAsaServerList } from '../asa/asaParser.js';
import { filterWoaServers } from '../asa/serverFilter.js';
import { compareServersByMapOrder } from '../utils/ordering.js';
import { calculatePlayerUtilization, summarisePlayers } from '../utils/playerStats.js';
import { observeServerStatus, shouldRecordTransition } from './serverStateEngine.js';
import type { ServerRepository } from './serverRepository.js';
import type {
  ApiServer,
  KnownServerRecord,
  MasterListStatus,
  ParsedAsaServer,
  ServersApiResponse,
  ServerStatus,
} from './types.js';

export class ServerService {
  private cachedResponse: { expiresAt: number; payload: ServersApiResponse } | null = null;

  constructor(
    private readonly config: AppConfig,
    private readonly repository: ServerRepository,
  ) {}

  async pollOnce(now = new Date()): Promise<{
    ok: boolean;
    matched: number;
    skipped: number;
    error?: string;
  }> {
    try {
      const payload = await fetchAsaUnofficialServerList({
        url: this.config.asaServerListUrl,
        timeoutMs: this.config.asaFetchTimeoutMs,
      });

      const { servers: parsed, skipped } = parseAsaServerList(payload);
      const matched = filterWoaServers(parsed, this.config.serverNameFilter);
      this.applySuccessfulPoll(matched, now);
      this.repository.setPollSuccess(now);
      this.invalidateCache();

      return { ok: true, matched: matched.length, skipped };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown ASA poll failure';
      const health = this.repository.getPollHealth();
      this.repository.setPollFailure(now, message, health.consecutiveFailures + 1);
      // Critical: do not mutate per-server statuses on master-list failure.
      this.invalidateCache();
      return { ok: false, matched: 0, skipped: 0, error: message };
    }
  }

  getServersPayload(now = new Date()): ServersApiResponse {
    if (this.cachedResponse && this.cachedResponse.expiresAt > now.getTime()) {
      return this.cachedResponse.payload;
    }

    const payload = this.buildPayload(now);
    if (this.config.cacheTtlSeconds > 0) {
      this.cachedResponse = {
        expiresAt: now.getTime() + this.config.cacheTtlSeconds * 1000,
        payload,
      };
    }
    return payload;
  }

  getServerById(id: string, now = new Date()): ApiServer | null {
    const payload = this.getServersPayload(now);
    return payload.servers.find((server) => server.id === id) ?? null;
  }

  invalidateCache(): void {
    this.cachedResponse = null;
  }

  private applySuccessfulPoll(liveServers: ParsedAsaServer[], now: Date): void {
    const known = this.repository.listServers();
    const liveById = new Map(liveServers.map((server) => [server.id, server]));
    const knownById = new Map(known.map((server) => [server.id, server]));

    for (const live of liveServers) {
      const existing = knownById.get(live.id);
      if (!existing) {
        this.createServer(live, now);
        continue;
      }
      this.updateObservedServer(existing, live, true, now);
    }

    for (const existing of known) {
      if (liveById.has(existing.id)) {
        continue;
      }
      this.updateObservedServer(existing, null, false, now);
    }
  }

  private createServer(live: ParsedAsaServer, now: Date): void {
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

    this.repository.upsertServer(record);
    this.repository.insertTransition({
      serverId: record.id,
      fromStatus: null,
      toStatus: 'online',
      observedAt: now,
      note: 'Discovered in ASA unofficial server list',
    });
  }

  private updateObservedServer(
    existing: KnownServerRecord,
    live: ParsedAsaServer | null,
    present: boolean,
    now: Date,
  ): void {
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

    this.repository.upsertServer(updated);

    if (shouldRecordTransition(previousStatus, nextStatus)) {
      this.repository.insertTransition({
        serverId: existing.id,
        fromStatus: previousStatus,
        toStatus: nextStatus,
        observedAt: now,
        note: present
          ? 'Returned in ASA unofficial server list'
          : 'Absent from latest successful ASA unofficial server list',
      });
    }
  }

  private buildPayload(now: Date): ServersApiResponse {
    const health = this.repository.getPollHealth();
    const masterListStatus = this.resolveMasterListStatus(health.lastSuccessfulPollAt, now);
    const known = this.repository.listServers().sort((a, b) =>
      compareServersByMapOrder(a, b, this.config.mapOrder),
    );
    const historyByServer = this.repository.listTransitionsForServers(
      known.map((server) => server.id),
    );

    const apiServers: ApiServer[] = known.map((server) => this.toApiServer(server, historyByServer));
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
      possiblyUpdating: apiServers.filter((server) => server.status === 'possibly_updating').length,
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
    historyByServer: Map<string, ReturnType<ServerRepository['listTransitions']>>,
  ): ApiServer {
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
