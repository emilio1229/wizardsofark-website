import { DEFAULT_MAP_ORDER } from '@woa/shared';

export type AppConfiguration = {
  nodeEnv: string;
  port: number;
  host: string;
  databaseUrl: string;
  frontendUrl: string;
  corsOrigin: string;
  arkStatusBaseUrl: string;
  arkStatusApiKey: string;
  serverNameFilter: string;
  arkServerPollIntervalMs: number;
  restartingThresholdSeconds: number;
  offlineThresholdSeconds: number;
  serverRetentionDays: number;
  cacheTtlSeconds: number;
  fetchTimeoutMs: number;
  masterListStaleSeconds: number;
  mapOrder: string[];
  redisUrl: string | null;
  discordClientId: string;
  discordClientSecret: string;
  discordRedirectUri: string;
  authAdminDiscordIds: string[];
  authLocalBypass: boolean;
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
    arkStatusBaseUrl: (process.env.ARKSTATUS_BASE_URL ?? 'https://arkstatus.com/api/v1').replace(
      /\/+$/,
      '',
    ),
    arkStatusApiKey: process.env.ARKSTATUS_API_KEY ?? '',
    serverNameFilter: process.env.SERVER_NAME_FILTER ?? 'The Wizards Of Ark',
    arkServerPollIntervalMs: Number(pollIntervalRaw ?? 60_000),
    restartingThresholdSeconds: Number(process.env.RESTARTING_THRESHOLD_SECONDS ?? 180),
    offlineThresholdSeconds: Number(process.env.OFFLINE_THRESHOLD_SECONDS ?? 600),
    serverRetentionDays: Number(process.env.SERVER_RETENTION_DAYS ?? 5),
    cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 45),
    fetchTimeoutMs: Number(process.env.FETCH_TIMEOUT_MS ?? 30_000),
    masterListStaleSeconds: Number(process.env.MASTER_LIST_STALE_SECONDS ?? 180),
    mapOrder: parseMapOrder(process.env.MAP_ORDER),
    redisUrl: process.env.REDIS_URL?.trim() ? process.env.REDIS_URL.trim() : null,
    discordClientId: process.env.DISCORD_CLIENT_ID ?? '',
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    discordRedirectUri:
      process.env.DISCORD_REDIRECT_URI ??
      'http://localhost:3001/api/v1/auth/discord/callback',
    authAdminDiscordIds: (process.env.AUTH_ADMIN_DISCORD_IDS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    authLocalBypass: process.env.AUTH_LOCAL_BYPASS === 'true',
  };
};
