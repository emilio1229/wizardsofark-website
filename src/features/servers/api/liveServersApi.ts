import { apiClient, type ApiResult } from '../../../api/client';
import type { LiveServer, ServersNetworkResponse } from '../types/liveServers';
import { arkMaps } from '../../../data/servers';
import type { ArkMap } from '../../../types';

export async function fetchServersNetwork(): Promise<ApiResult<ServersNetworkResponse>> {
  try {
    const { data } = await apiClient.get<ServersNetworkResponse>('/servers');
    return {
      status: 'success',
      data,
      updatedAt: data.lastSuccessfulPoll ?? data.lastUpdated ?? new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error : new Error('Failed to load servers'),
    };
  }
}

export async function fetchLiveServerById(serverId: string): Promise<ApiResult<LiveServer | null>> {
  try {
    const { data } = await apiClient.get<LiveServer>(`/servers/${encodeURIComponent(serverId)}`);
    return {
      status: 'success',
      data,
      updatedAt: data.lastChecked ?? new Date().toISOString(),
    };
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return { status: 'success', data: null, updatedAt: new Date().toISOString() };
    }

    return {
      status: 'error',
      error: error instanceof Error ? error : new Error('Failed to load server'),
    };
  }
}

export async function fetchMaps(): Promise<ApiResult<ArkMap[]>> {
  return { status: 'success', data: arkMaps, updatedAt: new Date().toISOString() };
}

export function getMapById(mapId: string): ArkMap | undefined {
  return arkMaps.find((map) => map.id === mapId);
}
