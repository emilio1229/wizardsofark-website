import { arkMaps } from '../data/servers';
import type { ArkMap, ServerDetail } from '../types';
import type { ApiResult } from './client';
import {
  fetchLiveServerById,
  fetchMaps as fetchLiveMaps,
  fetchServersNetwork,
  getMapById as getLiveMapById,
} from '../features/servers/api/liveServersApi';
import type { LiveServer, ServersNetworkResponse } from '../features/servers/types/liveServers';
import { serverEnrichmentByMapId } from '../data/serverEnrichment';

export type { ServersNetworkResponse, LiveServer };

export async function fetchServersNetworkResult(): Promise<ApiResult<ServersNetworkResponse>> {
  return fetchServersNetwork();
}

/** @deprecated Prefer fetchServersNetworkResult — kept for callers expecting a list shape. */
export async function fetchServers(): Promise<ApiResult<LiveServer[]>> {
  const result = await fetchServersNetwork();
  if (result.status === 'error') {
    return {
      status: 'error',
      error: result.error,
      updatedAt: result.updatedAt,
    };
  }
  return {
    status: 'success',
    data: result.data.servers,
    updatedAt: result.updatedAt,
  };
}

export async function fetchServerById(serverId: string): Promise<ApiResult<ServerDetail | null>> {
  const result = await fetchLiveServerById(serverId);
  if (result.status === 'error') {
    return {
      status: 'error',
      error: result.error,
      updatedAt: result.updatedAt,
    };
  }
  if (!result.data) {
    return { status: 'success', data: null, updatedAt: result.updatedAt };
  }

  const live = result.data;
  const enrichment = serverEnrichmentByMapId[live.mapId];

  const detail: ServerDetail = {
    id: live.id,
    name: live.name,
    mapId: live.mapId,
    mapName: live.map,
    status: live.status,
    players: live.players ?? 0,
    maxPlayers: live.maxPlayers ?? 0,
    playerUtilization: live.playerUtilization,
    gameMode: live.isPve === null ? 'Unknown' : live.isPve ? 'PvE' : 'PvP',
    type: 'Unofficial',
    ip: live.ip,
    port: live.gamePort,
    gamePort: live.gamePort,
    queryPort: live.queryPort,
    version: live.version ?? 'Unavailable',
    firstSeen: live.firstSeen,
    lastSeen: live.lastSeen,
    lastChecked: live.lastChecked,
    missingSince: live.missingSince,
    description:
      enrichment?.description ??
      `${live.map} — live status from the public ASA unofficial server list.`,
    mods: enrichment?.mods ?? [],
    settings: enrichment?.settings ?? [],
    rules: enrichment?.rules ?? ['Follow General and Building rules'],
    recentPlayers: [],
    statusExplanation: live.statusExplanation ?? null,
    statusHistory: live.statusHistory,
  };

  return { status: 'success', data: detail, updatedAt: result.updatedAt };
}

export async function fetchMaps(): Promise<ApiResult<ArkMap[]>> {
  return fetchLiveMaps();
}

export function getMapById(mapId: string): ArkMap | undefined {
  return getLiveMapById(mapId) ?? arkMaps.find((map) => map.id === mapId);
}
