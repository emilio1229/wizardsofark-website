import { loadConfig } from './config/env.js';
import { buildApp } from './app.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const { app, poller } = await buildApp(config);

  await app.listen({ port: config.port, host: config.host });
  app.log.info(
    {
      filter: config.serverNameFilter,
      pollIntervalSeconds: config.pollIntervalSeconds,
      databasePath: config.databasePath,
    },
    'Wizards of Ark server monitor started',
  );

  await poller.start();
}

main().catch((error) => {
  console.error('Failed to start server monitor', error);
  process.exit(1);
});
