export type ServerStatus = 'online' | 'restarting' | 'possibly_updating' | 'offline';

export type MasterListStatus = 'healthy' | 'stale' | 'unavailable';

export type ParsedAsaServer = {
  id: string;
  sessionId: string | null;
  name: string;
  sessionName: string | null;
  mapName: string | null;
  mapDisplayName: string;
  mapId: string;
  ip: string;
  gamePort: number;
  /** ASA unofficial list does not currently expose a numeric query port. */
  queryPort: number | null;
  players: number;
  maxPlayers: number;
  version: string | null;
  ping: number | null;
  clusterId: string | null;
  isPve: boolean | null;
  asaLastUpdated: number | null;
};

export type KnownServerRecord = {
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
  currentStatus: ServerStatus;
  previousStatus: ServerStatus | null;
  players: number | null;
  maxPlayers: number | null;
  version: string | null;
  ping: number | null;
  clusterId: string | null;
  isPve: boolean | null;
  missingSince: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type StatusTransition = {
  id: number;
  serverId: string;
  fromStatus: ServerStatus | null;
  toStatus: ServerStatus;
  observedAt: Date;
  note: string | null;
};

export type PollHealth = {
  lastAttemptAt: Date | null;
  lastSuccessfulPollAt: Date | null;
  lastError: string | null;
  consecutiveFailures: number;
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

export type ApiServer = {
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
  status: ServerStatus;
  version: string | null;
  ping: number | null;
  clusterId: string | null;
  isPve: boolean | null;
  firstSeen: string;
  lastSeen: string | null;
  lastChecked: string;
  missingSince: string | null;
  statusHistory: Array<{
    fromStatus: ServerStatus | null;
    toStatus: ServerStatus;
    observedAt: string;
    note: string | null;
  }>;
};

export type ServersApiResponse = {
  network: string;
  lastUpdated: string | null;
  lastSuccessfulPoll: string | null;
  masterListStatus: MasterListStatus;
  dataStale: boolean;
  summary: NetworkSummary;
  servers: ApiServer[];
};
