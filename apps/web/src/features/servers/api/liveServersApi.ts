import type { ApiResult } from '../../../api/client';
import { arkMaps } from '../../../data/servers';
import type { ArkMap } from '../../../types';
import type { LiveServer, ServersNetworkResponse } from '../types/liveServers';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const body = (await response.json()) as { data?: T } | T;
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export async function fetchServersNetwork(): Promise<ApiResult<ServersNetworkResponse>> {
  try {
    const data = await getJson<ServersNetworkResponse>('/servers');
    return { status: 'success', data, updatedAt: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error : new Error(String(error)),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function fetchLiveServerById(serverId: string): Promise<ApiResult<LiveServer | null>> {
  try {
    const data = await getJson<LiveServer>(`/servers/${encodeURIComponent(serverId)}`);
    return { status: 'success', data, updatedAt: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error : new Error(String(error)),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function fetchMaps(): Promise<ApiResult<ArkMap[]>> {
  return {
    status: 'success',
    data: arkMaps,
    updatedAt: new Date().toISOString(),
  };
}

export function getMapById(mapId: string): ArkMap | undefined {
  return arkMaps.find((map) => map.id === mapId);
}
