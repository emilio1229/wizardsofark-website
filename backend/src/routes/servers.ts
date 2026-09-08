import type { FastifyInstance } from 'fastify';
import type { ServerService } from '../server/serverService.js';
import { statusExplanation } from '../server/serverService.js';

export async function registerServerRoutes(
  app: FastifyInstance,
  service: ServerService,
): Promise<void> {
  app.get('/api/servers', async (_request, reply) => {
    const payload = service.getServersPayload();
    return reply.send(payload);
  });

  app.get<{ Params: { serverId: string } }>('/api/servers/:serverId', async (request, reply) => {
    const server = service.getServerById(decodeURIComponent(request.params.serverId));
    if (!server) {
      return reply.status(404).send({ error: 'Server not found' });
    }

    return reply.send({
      ...server,
      statusExplanation: statusExplanation(server.status),
    });
  });

  app.get('/api/health', async (_request, reply) => {
    const payload = service.getServersPayload();
    return reply.send({
      ok: true,
      masterListStatus: payload.masterListStatus,
      lastSuccessfulPoll: payload.lastSuccessfulPoll,
      totalServers: payload.summary.totalServers,
    });
  });

  app.get('/health', async (_request, reply) => {
    return reply.send({ ok: true });
  });
}
