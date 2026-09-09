import { DEFAULT_MAP_ORDER } from '@woa/shared';

export type AppConfiguration = {
  nodeEnv: string;
  port: number;
  host: string;
  databaseUrl: string;
  frontendUrl: string;
  corsOrigin: string;
  arkApiUrl: string;
  serverNameFilter: string;
  arkServerPollIntervalMs: number;
  restartingThresholdSeconds: number;
  offlineThresholdSeconds: number;
  cacheTtlSeconds: number;
  asaFetchTimeoutMs: number;
  masterListStaleSeconds: number;
  mapOrder: string[];
  redisUrl: string | null;
};

function parseMapOrder(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) {
    return [...DEFAULT_MAP_ORDER];
  }
  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : [...DEFAULT_MAP_ORDER];
}

export default (): AppConfiguration => {
  const pollIntervalRaw =
    process.env.ARK_SERVER_POLL_INTERVAL ??
    (process.env.POLL_INTERVAL_SECONDS
      ? String(Number(process.env.POLL_INTERVAL_SECONDS) * 1000)
      : undefined);

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3001),
    host: process.env.HOST ?? '0.0.0.0',
    databaseUrl: process.env.DATABASE_URL ?? '',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    corsOrigin: process.env.CORS_ORIGIN ?? process.env.FRONTEND_URL ?? '*',
    arkApiUrl:
      process.env.ARK_API_URL ??
      process.env.ASA_SERVER_LIST_URL ??
      'https://cdn2.arkdedicated.com/servers/asa/unofficialserverlist.json',
    serverNameFilter: process.env.SERVER_NAME_FILTER ?? 'The Wizards Of Ark',
    arkServerPollIntervalMs: Number(pollIntervalRaw ?? 60_000),
    restartingThresholdSeconds: Number(process.env.RESTARTING_THRESHOLD_SECONDS ?? 180),
    offlineThresholdSeconds: Number(process.env.OFFLINE_THRESHOLD_SECONDS ?? 600),
    cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 45),
    asaFetchTimeoutMs: Number(process.env.ASA_FETCH_TIMEOUT_MS ?? 30_000),
    masterListStaleSeconds: Number(process.env.MASTER_LIST_STALE_SECONDS ?? 180),
    mapOrder: parseMapOrder(process.env.MAP_ORDER),
    redisUrl: process.env.REDIS_URL?.trim() ? process.env.REDIS_URL.trim() : null,
  };
};
