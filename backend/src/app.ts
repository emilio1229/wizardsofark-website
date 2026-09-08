import path from 'node:path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fs from 'node:fs';
import type { AppConfig } from './config/env.js';
import { createDatabase } from './database/client.js';
import { registerServerRoutes } from './routes/servers.js';
import { createServerPoller } from './jobs/serverPoller.js';
import { ServerRepository } from './server/serverRepository.js';
import { ServerService } from './server/serverService.js';

export async function buildApp(config: AppConfig) {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((value) => value.trim()),
  });

  const { sqlite, db } = createDatabase(config.databasePath);
  const repository = new ServerRepository(db);
  const service = new ServerService(config, repository);
  const poller = createServerPoller(service, {
    intervalSeconds: config.pollIntervalSeconds,
    logger: app.log,
  });

  await registerServerRoutes(app, service);

  if (config.staticDir && fs.existsSync(config.staticDir)) {
    await app.register(fastifyStatic, {
      root: path.resolve(config.staticDir),
      wildcard: false,
    });

    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api/')) {
        return reply.status(404).send({ error: 'Not found' });
      }
      return reply.sendFile('index.html');
    });
  }

  app.addHook('onClose', async () => {
    poller.stop();
    sqlite.close();
  });

  return { app, service, poller };
}
