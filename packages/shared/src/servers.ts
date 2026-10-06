export type LiveServerStatus = 'online' | 'offline' | 'restarting' | 'possibly_updating';

/** Alias used by NestJS server engine / Prisma status fields. */
export type ServerStatus = LiveServerStatus;

export type MasterListStatus = 'healthy' | 'stale' | 'unavailable';

export type StatusHistoryEntry = {
  fromStatus: LiveServerStatus | null;
  toStatus: LiveServerStatus;
  observedAt: string;
  note: string | null;
};

export type LiveServer = {
  id: string;
  name: string;
  map: string;
  mapId: string;
  mapName: string | null;
  ip: string;
  gamePort: number;
  queryPort: number | null;
  players: number | null;
  maxPlayers: number | null;
  playerUtilization: number | null;
  status: LiveServerStatus;
  version: string | null;
  ping: number | null;
  clusterId: string | null;
  isPve: boolean | null;
  firstSeen: string;
  lastSeen: string | null;
  lastChecked: string;
  missingSince: string | null;
  statusHistory: StatusHistoryEntry[];
  statusExplanation?: string | null;
};

export type NetworkSummary = {
  totalServers: number;
  online: number;
  restarting: number;
  possiblyUpdating: number;
  offline: number;
  currentPlayers: number;
  maxPlayers: number;
};

export type ServersNetworkResponse = {
  network: string;
  lastUpdated: string | null;
  lastSuccessfulPoll: string | null;
  masterListStatus: MasterListStatus;
  dataStale: boolean;
  summary: NetworkSummary;
  servers: LiveServer[];
};

export type ApiEnvelope<T> = {
  data: T;
  meta: Record<string, unknown>;
};

/**
 * One cell of the activity grid. `dow` is UTC day-of-week (0=Sunday) and `hour`
 * is UTC hour, so the client can shift buckets into the visitor's timezone.
 */
export type ActivityCell = {
  dow: number;
  hour: number;
  avgPlayers: number;
  avgUtilization: number | null;
  samples: number;
};

/** Aggregate of one UTC day-of-week across the whole history window. */
export type ActivityDayTotal = {
  dow: number;
  avgPlayers: number;
  samples: number;
};

export type ActivityPeak = {
  dow: number;
  hour: number;
  avgPlayers: number;
  samples: number;
};

export type ServerActivityResponse = {
  serverId: string;
  /** Always "UTC" — the client converts buckets to the visitor's locale. */
  gridTimezone: 'UTC';
  /** Days of history the aggregate covers. */
  windowDays: number;
  since: string | null;
  until: string | null;
  totalSamples: number;
  maxPlayers: number;
  /** 168 cells (7 x 24), always fully populated; empty slots have samples 0. */
  cells: ActivityCell[];
  perDay: ActivityDayTotal[];
  busiest: ActivityPeak | null;
  quietest: ActivityPeak | null;
};

export type ApiErrorBody = {
  statusCode: number;
  error: string;
  message: string;
};

export const DEFAULT_MAP_ORDER = [
  'The Island',
  'Scorched Earth',
  'Aberration',
  'Extinction',
  'Ragnarok',
  'Valguero',
  'Genesis Part 1',
  'Genesis Part 2',
  'The Center',
  'Lost Colony',
  'Astraeos',
  'Dragontopia',
  'Amissa',
  'Bjarnheim',
] as const;

export const WS_EVENTS = {
  SERVERS_UPDATED: 'servers.updated',
  SERVER_UPDATED: 'server.updated',
  SERVER_ONLINE: 'server.online',
  SERVER_OFFLINE: 'server.offline',
  SERVER_PLAYER_COUNT_CHANGED: 'server.playerCountChanged',
} as const;
