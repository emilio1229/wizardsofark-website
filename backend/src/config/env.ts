import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
loadDotenv({ path: path.join(backendRoot, '.env') });
loadDotenv({ path: path.join(backendRoot, '../.env') });

const DEFAULT_MAP_ORDER = [
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

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  HOST: z.string().default('0.0.0.0'),
  ASA_SERVER_LIST_URL: z
    .string()
    .url()
    .default('https://cdn2.arkdedicated.com/servers/asa/unofficialserverlist.json'),
  SERVER_NAME_FILTER: z.string().min(1).default('The Wizards Of Ark'),
  POLL_INTERVAL_SECONDS: z.coerce.number().int().positive().default(60),
  RESTARTING_THRESHOLD_SECONDS: z.coerce.number().int().nonnegative().default(180),
  OFFLINE_THRESHOLD_SECONDS: z.coerce.number().int().positive().default(600),
  CACHE_TTL_SECONDS: z.coerce.number().int().nonnegative().default(45),
  ASA_FETCH_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  MASTER_LIST_STALE_SECONDS: z.coerce.number().int().positive().default(180),
  DATABASE_PATH: z.string().default(path.join(backendRoot, '../data/woa-servers.sqlite')),
  STATIC_DIR: z.string().optional().default(''),
  CORS_ORIGIN: z.string().default('*'),
  MAP_ORDER: z.string().optional(),
});

export type AppConfig = {
  port: number;
  host: string;
  asaServerListUrl: string;
  serverNameFilter: string;
  pollIntervalSeconds: number;
  restartingThresholdSeconds: number;
  offlineThresholdSeconds: number;
  cacheTtlSeconds: number;
  asaFetchTimeoutMs: number;
  masterListStaleSeconds: number;
  databasePath: string;
  staticDir: string | null;
  corsOrigin: string;
  mapOrder: string[];
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

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid backend configuration: ${details}`);
  }

  const data = parsed.data;
  if (data.RESTARTING_THRESHOLD_SECONDS >= data.OFFLINE_THRESHOLD_SECONDS) {
    throw new Error(
      'Invalid backend configuration: RESTARTING_THRESHOLD_SECONDS must be less than OFFLINE_THRESHOLD_SECONDS',
    );
  }

  const databasePath = path.isAbsolute(data.DATABASE_PATH)
    ? data.DATABASE_PATH
    : path.resolve(backendRoot, data.DATABASE_PATH);

  const staticDir = data.STATIC_DIR?.trim()
    ? path.isAbsolute(data.STATIC_DIR)
      ? data.STATIC_DIR
      : path.resolve(backendRoot, data.STATIC_DIR)
    : null;

  return {
    port: data.PORT,
    host: data.HOST,
    asaServerListUrl: data.ASA_SERVER_LIST_URL,
    serverNameFilter: data.SERVER_NAME_FILTER,
    pollIntervalSeconds: data.POLL_INTERVAL_SECONDS,
    restartingThresholdSeconds: data.RESTARTING_THRESHOLD_SECONDS,
    offlineThresholdSeconds: data.OFFLINE_THRESHOLD_SECONDS,
    cacheTtlSeconds: data.CACHE_TTL_SECONDS,
    asaFetchTimeoutMs: data.ASA_FETCH_TIMEOUT_MS,
    masterListStaleSeconds: data.MASTER_LIST_STALE_SECONDS,
    databasePath,
    staticDir,
    corsOrigin: data.CORS_ORIGIN,
    mapOrder: parseMapOrder(data.MAP_ORDER),
  };
}
