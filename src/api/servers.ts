import { arkMaps, servers, toServerSummary } from '../data/servers';
import type { ArkMap, ServerDetail, ServerSummary } from '../types';
import type { ApiResult } from './client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function withJitter(server: ServerDetail): ServerDetail {
  if (server.status !== 'online') {
    return server;
  }

  const delta = Math.floor(Math.random() * 3) - 1;
  const players = Math.max(0, Math.min(server.maxPlayers, server.players + delta));
  return { ...server, players };
}

export async function fetchServers(): Promise<ApiResult<ServerSummary[]>> {
  await delay(350);
  try {
    const data = servers.map((server) => toServerSummary(withJitter(server)));
    return { status: 'success', data, updatedAt: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error : new Error('Failed to load servers'),
    };
  }
}

export async function fetchServerById(serverId: string): Promise<ApiResult<ServerDetail | null>> {
  await delay(280);
  try {
    const found = servers.find((server) => server.id === serverId);
    if (!found) {
      return { status: 'success', data: null, updatedAt: new Date().toISOString() };
    }
    return {
      status: 'success',
      data: withJitter(found),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error : new Error('Failed to load server'),
    };
  }
}

export async function fetchMaps(): Promise<ApiResult<ArkMap[]>> {
  await delay(120);
  return { status: 'success', data: arkMaps, updatedAt: new Date().toISOString() };
}

export function getMapById(mapId: string): ArkMap | undefined {
  return arkMaps.find((map) => map.id === mapId);
}
