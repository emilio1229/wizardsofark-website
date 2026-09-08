import { and, desc, eq, inArray } from 'drizzle-orm';
import type { Db } from '../database/client.js';
import { pollMeta, servers, statusTransitions } from '../database/schema.js';
import type {
  KnownServerRecord,
  PollHealth,
  ServerStatus,
  StatusTransition,
} from './types.js';

function toIso(date: Date): string {
  return date.toISOString();
}

function fromIso(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapServerRow(row: typeof servers.$inferSelect): KnownServerRecord {
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
    firstSeen: fromIso(row.firstSeen) ?? new Date(0),
    lastSeen: fromIso(row.lastSeen),
    lastChecked: fromIso(row.lastChecked) ?? new Date(0),
    currentStatus: row.currentStatus as ServerStatus,
    previousStatus: (row.previousStatus as ServerStatus | null) ?? null,
    players: row.players,
    maxPlayers: row.maxPlayers,
    version: row.version,
    ping: row.ping,
    clusterId: row.clusterId,
    isPve: row.isPve === null ? null : Boolean(row.isPve),
    missingSince: fromIso(row.missingSince),
    createdAt: fromIso(row.createdAt) ?? new Date(0),
    updatedAt: fromIso(row.updatedAt) ?? new Date(0),
  };
}

export class ServerRepository {
  constructor(private readonly db: Db) {}

  listServers(): KnownServerRecord[] {
    return this.db.select().from(servers).all().map(mapServerRow);
  }

  getServer(id: string): KnownServerRecord | null {
    const row = this.db.select().from(servers).where(eq(servers.id, id)).get();
    return row ? mapServerRow(row) : null;
  }

  upsertServer(record: KnownServerRecord): void {
    this.db
      .insert(servers)
      .values({
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
        firstSeen: toIso(record.firstSeen),
        lastSeen: record.lastSeen ? toIso(record.lastSeen) : null,
        lastChecked: toIso(record.lastChecked),
        currentStatus: record.currentStatus,
        previousStatus: record.previousStatus,
        players: record.players,
        maxPlayers: record.maxPlayers,
        version: record.version,
        ping: record.ping,
        clusterId: record.clusterId,
        isPve: record.isPve === null ? null : record.isPve ? 1 : 0,
        missingSince: record.missingSince ? toIso(record.missingSince) : null,
        createdAt: toIso(record.createdAt),
        updatedAt: toIso(record.updatedAt),
      })
      .onConflictDoUpdate({
        target: servers.id,
        set: {
          sessionId: record.sessionId,
          name: record.name,
          sessionName: record.sessionName,
          mapName: record.mapName,
          mapDisplayName: record.mapDisplayName,
          mapId: record.mapId,
          ip: record.ip,
          gamePort: record.gamePort,
          queryPort: record.queryPort,
          firstSeen: toIso(record.firstSeen),
          lastSeen: record.lastSeen ? toIso(record.lastSeen) : null,
          lastChecked: toIso(record.lastChecked),
          currentStatus: record.currentStatus,
          previousStatus: record.previousStatus,
          players: record.players,
          maxPlayers: record.maxPlayers,
          version: record.version,
          ping: record.ping,
          clusterId: record.clusterId,
          isPve: record.isPve === null ? null : record.isPve ? 1 : 0,
          missingSince: record.missingSince ? toIso(record.missingSince) : null,
          updatedAt: toIso(record.updatedAt),
        },
      })
      .run();
  }

  insertTransition(input: {
    serverId: string;
    fromStatus: ServerStatus | null;
    toStatus: ServerStatus;
    observedAt: Date;
    note?: string | null;
  }): void {
    this.db
      .insert(statusTransitions)
      .values({
        serverId: input.serverId,
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
        observedAt: toIso(input.observedAt),
        note: input.note ?? null,
      })
      .run();
  }

  listTransitions(serverId: string, limit = 20): StatusTransition[] {
    return this.db
      .select()
      .from(statusTransitions)
      .where(eq(statusTransitions.serverId, serverId))
      .orderBy(desc(statusTransitions.observedAt), desc(statusTransitions.id))
      .limit(limit)
      .all()
      .map((row) => ({
        id: row.id,
        serverId: row.serverId,
        fromStatus: (row.fromStatus as ServerStatus | null) ?? null,
        toStatus: row.toStatus as ServerStatus,
        observedAt: fromIso(row.observedAt) ?? new Date(0),
        note: row.note,
      }));
  }

  listTransitionsForServers(serverIds: string[], limitPerServer = 12): Map<string, StatusTransition[]> {
    const result = new Map<string, StatusTransition[]>();
    if (serverIds.length === 0) {
      return result;
    }

    const rows = this.db
      .select()
      .from(statusTransitions)
      .where(inArray(statusTransitions.serverId, serverIds))
      .orderBy(desc(statusTransitions.observedAt), desc(statusTransitions.id))
      .all();

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
        observedAt: fromIso(row.observedAt) ?? new Date(0),
        note: row.note,
      });
      result.set(row.serverId, list);
    }

    return result;
  }

  getPollHealth(): PollHealth {
    const lastAttempt = this.getMeta('last_attempt_at');
    const lastSuccess = this.getMeta('last_successful_poll_at');
    const lastError = this.getMeta('last_error');
    const failures = this.getMeta('consecutive_failures');

    return {
      lastAttemptAt: fromIso(lastAttempt),
      lastSuccessfulPollAt: fromIso(lastSuccess),
      lastError,
      consecutiveFailures: failures ? Number(failures) || 0 : 0,
    };
  }

  setPollSuccess(at: Date): void {
    this.setMeta('last_attempt_at', toIso(at));
    this.setMeta('last_successful_poll_at', toIso(at));
    this.setMeta('last_error', '');
    this.setMeta('consecutive_failures', '0');
  }

  setPollFailure(at: Date, errorMessage: string, consecutiveFailures: number): void {
    this.setMeta('last_attempt_at', toIso(at));
    this.setMeta('last_error', errorMessage.slice(0, 500));
    this.setMeta('consecutive_failures', String(consecutiveFailures));
  }

  private getMeta(key: string): string | null {
    const row = this.db.select().from(pollMeta).where(eq(pollMeta.key, key)).get();
    return row?.value ?? null;
  }

  private setMeta(key: string, value: string): void {
    const updatedAt = toIso(new Date());
    this.db
      .insert(pollMeta)
      .values({ key, value, updatedAt })
      .onConflictDoUpdate({
        target: pollMeta.key,
        set: { value, updatedAt },
      })
      .run();
  }

  /** Used only if we ever need conditional updates — kept for clarity. */
  touchChecked(ids: string[], at: Date): void {
    if (ids.length === 0) {
      return;
    }
    const iso = toIso(at);
    for (const id of ids) {
      this.db
        .update(servers)
        .set({ lastChecked: iso, updatedAt: iso })
        .where(and(eq(servers.id, id)))
        .run();
    }
  }
}
