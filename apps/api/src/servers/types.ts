import type { LiveServerStatus } from '@woa/shared';

export type ServerStatus = LiveServerStatus;

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

export type StatusTransitionRecord = {
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

export type MeaningfulServerChange = {
  serverId: string;
  previousStatus: ServerStatus | null;
  nextStatus: ServerStatus;
  previousPlayers: number | null;
  nextPlayers: number | null;
  discovered: boolean;
};
