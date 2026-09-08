export type LiveServerStatus = 'online' | 'offline' | 'restarting' | 'possibly_updating';

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
