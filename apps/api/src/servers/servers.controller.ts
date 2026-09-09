import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import type { LiveServer, ServersNetworkResponse } from '@woa/shared';
import { ServersService, statusExplanation } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get()
  async listServers(): Promise<ServersNetworkResponse> {
    return this.serversService.getServersPayload();
  }

  @Get(':id/status')
  async getServerStatus(@Param('id') id: string) {
    const status = await this.serversService.getServerStatus(decodeURIComponent(id));
    if (!status) {
      throw new NotFoundException('Server not found');
    }
    return status;
  }

  @Get(':id')
  async getServer(@Param('id') id: string): Promise<LiveServer> {
    const server = await this.serversService.getServerById(decodeURIComponent(id));
    if (!server) {
      throw new NotFoundException('Server not found');
    }
    return {
      ...server,
      statusExplanation: statusExplanation(server.status),
    };
  }
}
