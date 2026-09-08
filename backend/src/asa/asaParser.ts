import type { ParsedAsaServer } from '../server/types.js';
import { asaServerSchema, coerceBooleanFlag, coerceNumber } from './asaSchema.js';
import { normaliseMap } from './mapNormalizer.js';

function buildVersion(buildId: number | null, minorBuildId: number | null): string | null {
  if (buildId === null) {
    return null;
  }
  if (minorBuildId === null) {
    return String(buildId);
  }
  return `${buildId}.${minorBuildId}`;
}

function parseQueryPort(value: unknown): number | null {
  const numeric = coerceNumber(value);
  if (numeric === null) {
    return null;
  }
  if (!Number.isInteger(numeric) || numeric <= 0 || numeric > 65535) {
    return null;
  }
  return numeric;
}

export function buildServerId(ip: string, gamePort: number): string {
  return `${ip}:${gamePort}`;
}

export function parseAsaServer(raw: unknown): ParsedAsaServer | null {
  const parsed = asaServerSchema.safeParse(raw);
  if (!parsed.success) {
    return null;
  }

  const record = parsed.data;
  const ip = (record.IP ?? '').trim();
  const gamePort = coerceNumber(record.Port);
  const name = (record.Name ?? '').trim();

  if (!ip || gamePort === null || !Number.isInteger(gamePort) || gamePort <= 0 || !name) {
    return null;
  }

  const mapName = record.MapName === undefined || record.MapName === null ? null : String(record.MapName);
  const map = normaliseMap(mapName);
  const players = coerceNumber(record.NumPlayers);
  const maxPlayers = coerceNumber(record.MaxPlayers);
  const buildId = coerceNumber(record.BuildId);
  const minorBuildId = coerceNumber(record.MinorBuildId);
  const ping = coerceNumber(record.ServerPing);
  const asaLastUpdated = coerceNumber(record.LastUpdated);
  const clusterId = (record.ClusterId ?? '').trim() || null;
  const sessionId = (record.SessionID ?? '').trim() || null;
  const sessionName = (record.SessionName ?? '').trim() || null;

  return {
    id: buildServerId(ip, gamePort),
    sessionId,
    name,
    sessionName,
    mapName,
    mapDisplayName: map.displayName,
    mapId: map.mapId,
    ip,
    gamePort,
    queryPort: parseQueryPort(record.LatencyPort),
    players: players === null ? 0 : Math.max(0, Math.floor(players)),
    maxPlayers: maxPlayers === null ? 0 : Math.max(0, Math.floor(maxPlayers)),
    version: buildVersion(buildId, minorBuildId),
    ping,
    clusterId,
    isPve: coerceBooleanFlag(record.SessionIsPve),
    asaLastUpdated,
  };
}

export function parseAsaServerList(payload: unknown): {
  servers: ParsedAsaServer[];
  skipped: number;
} {
  if (!Array.isArray(payload)) {
    throw new Error('ASA server list payload is not an array');
  }

  const servers: ParsedAsaServer[] = [];
  let skipped = 0;

  for (const entry of payload) {
    try {
      const parsed = parseAsaServer(entry);
      if (!parsed) {
        skipped += 1;
        continue;
      }
      servers.push(parsed);
    } catch {
      skipped += 1;
    }
  }

  return { servers, skipped };
}
