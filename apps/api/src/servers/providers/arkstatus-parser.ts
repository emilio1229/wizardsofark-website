import type { ParsedServer } from "../types";
import {
  arkStatusEnvelopeSchema,
  arkStatusServerSchema,
  type ArkStatusServerRaw,
} from "./arkstatus-schema";
import { coerceNumber } from "./coerce";
import { normaliseMap } from "./map-normalizer";
import { buildServerId } from "./server-id";

export class ArkStatusParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArkStatusParseError";
  }
}

function parsePort(value: unknown): number | null {
  const numeric = coerceNumber(value);
  if (numeric === null) {
    return null;
  }
  if (!Number.isInteger(numeric) || numeric <= 0 || numeric > 65535) {
    return null;
  }
  return numeric;
}

/** Map the API's `game_mode` string onto the internal PvE/PvP flag. */
function parseIsPve(raw: ArkStatusServerRaw): boolean | null {
  const mode = (raw.game_mode ?? "").trim().toUpperCase();
  if (mode === "PVE") {
    return true;
  }
  if (mode === "PVP" || mode === "PVPVE") {
    return false;
  }
  return null;
}

/** Parse an ISO 8601 timestamp into epoch seconds (matches the internal field). */
function parseIsoToEpochSeconds(value: string | undefined): number | null {
  if (!value || !value.trim()) {
    return null;
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return Math.floor(parsed / 1000);
}

export function parseArkStatusServer(raw: unknown): ParsedServer | null {
  const parsed = arkStatusServerSchema.safeParse(raw);
  if (!parsed.success) {
    return null;
  }

  const record = parsed.data;
  const name = (record.name ?? "").trim();
  const connection = record.connection_info;
  // The `/servers` listing returns flat `ip`/`port`; the `/servers/{id}` detail
  // endpoint nests them under `connection_info`. Accept either shape.
  const ip = (record.ip ?? connection?.ip ?? "").trim();
  const gamePort = parsePort(record.port ?? connection?.port);

  // IP and port are required to build a stable id, so records lacking them are
  // skipped rather than throwing.
  if (!name || !ip || gamePort === null) {
    return null;
  }

  const mapName =
    record.map === undefined || record.map === null ? null : String(record.map);
  const map = normaliseMap(mapName);
  const players = coerceNumber(record.players);
  const maxPlayers = coerceNumber(record.max_players);
  const ping = coerceNumber(record.ping);

  return {
    id: buildServerId(ip, gamePort),
    sessionId: null,
    name,
    sessionName: null,
    mapName,
    mapDisplayName: map.displayName,
    mapId: map.mapId,
    ip,
    gamePort,
    queryPort: parsePort(connection?.query_port),
    players: players === null ? 0 : Math.max(0, Math.floor(players)),
    maxPlayers: maxPlayers === null ? 0 : Math.max(0, Math.floor(maxPlayers)),
    version:
      record.version === undefined || record.version === null
        ? null
        : String(record.version),
    ping: ping !== null && ping > 0 ? ping : null,
    clusterId: null,
    isPve: parseIsPve(record),
    sourceLastUpdated: parseIsoToEpochSeconds(
      record.last_updated ?? record.last_seen,
    ),
  };
}

/**
 * Extract the server array from an ARK Status envelope. The API wraps all
 * responses in `{ success, data, meta }`, and listing responses put the array
 * in `data`.
 */
export function parseArkStatusServerList(payload: unknown): {
  servers: ParsedServer[];
  skipped: number;
} {
  const envelope = arkStatusEnvelopeSchema.safeParse(payload);
  if (!envelope.success) {
    throw new ArkStatusParseError(
      "ARK Status payload did not match the response envelope",
    );
  }

  const { success, data, error } = envelope.data;
  if (success === false) {
    throw new ArkStatusParseError(
      `ARK Status API error: ${error?.message ?? error?.code ?? "unknown error"}`,
    );
  }

  if (!Array.isArray(data)) {
    throw new ArkStatusParseError("ARK Status response data is not an array");
  }

  const servers: ParsedServer[] = [];
  let skipped = 0;

  for (const entry of data) {
    try {
      const parsed = parseArkStatusServer(entry);
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
