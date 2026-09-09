export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const databaseUrl = config.DATABASE_URL;
  if (!databaseUrl || String(databaseUrl).trim() === '') {
    throw new Error('Invalid API configuration: DATABASE_URL is required');
  }

  const restarting = Number(config.RESTARTING_THRESHOLD_SECONDS ?? 180);
  const offline = Number(config.OFFLINE_THRESHOLD_SECONDS ?? 600);
  if (!Number.isFinite(restarting) || !Number.isFinite(offline)) {
    throw new Error('Invalid API configuration: status thresholds must be numbers');
  }
  if (restarting >= offline) {
    throw new Error(
      'Invalid API configuration: RESTARTING_THRESHOLD_SECONDS must be less than OFFLINE_THRESHOLD_SECONDS',
    );
  }

  const port = config.PORT !== undefined ? Number(config.PORT) : 3001;
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Invalid API configuration: PORT must be a positive integer');
  }

  const pollInterval = Number(
    config.ARK_SERVER_POLL_INTERVAL ??
      (config.POLL_INTERVAL_SECONDS !== undefined
        ? Number(config.POLL_INTERVAL_SECONDS) * 1000
        : 60_000),
  );
  if (!Number.isFinite(pollInterval) || pollInterval < 1000) {
    throw new Error(
      'Invalid API configuration: ARK_SERVER_POLL_INTERVAL must be >= 1000 (ms)',
    );
  }

  return config;
}
