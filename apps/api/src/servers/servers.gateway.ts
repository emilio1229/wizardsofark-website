import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WS_EVENTS, type LiveServer, type ServersNetworkResponse } from '@woa/shared';
import type { Server, Socket } from 'socket.io';
import type { MeaningfulServerChange } from './types';
import { ServersService } from './servers.service';

@WebSocketGateway({
  cors: {
    origin: true,
  },
  namespace: '/',
})
export class ServersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ServersGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(private readonly serversService: ServersService) {}

  handleConnection(client: Socket): void {
    this.logger.debug(`WS client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`WS client disconnected: ${client.id}`);
  }

  async emitMeaningfulChanges(changes: MeaningfulServerChange[]): Promise<void> {
    if (changes.length === 0) {
      return;
    }

    const payload = await this.serversService.getServersPayload();
    this.server.emit(WS_EVENTS.SERVERS_UPDATED, payload);

    const byId = new Map(payload.servers.map((server) => [server.id, server]));

    for (const change of changes) {
      const live = byId.get(change.serverId);
      if (!live) {
        continue;
      }

      this.server.emit(WS_EVENTS.SERVER_UPDATED, live);
      this.emitStatusEvents(change, live, payload);
      this.emitPlayerEvents(change, live);
    }
  }

  private emitStatusEvents(
    change: MeaningfulServerChange,
    live: LiveServer,
    _payload: ServersNetworkResponse,
  ): void {
    if (change.previousStatus === change.nextStatus) {
      return;
    }

    if (change.nextStatus === 'online') {
      this.server.emit(WS_EVENTS.SERVER_ONLINE, live);
      return;
    }

    if (change.nextStatus === 'offline') {
      this.server.emit(WS_EVENTS.SERVER_OFFLINE, live);
    }
  }

  private emitPlayerEvents(change: MeaningfulServerChange, live: LiveServer): void {
    if (change.previousPlayers === change.nextPlayers) {
      return;
    }
    this.server.emit(WS_EVENTS.SERVER_PLAYER_COUNT_CHANGED, {
      id: live.id,
      players: live.players,
      maxPlayers: live.maxPlayers,
      previousPlayers: change.previousPlayers,
    });
  }
}
