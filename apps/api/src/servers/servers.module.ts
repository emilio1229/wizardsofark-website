import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArkStatusProvider } from './providers/arkstatus.provider';
import { SERVER_PROVIDER } from './providers/server-provider.interface';
import { ServersController } from './servers.controller';
import { ServersGateway } from './servers.gateway';
import { ServersPoller } from './servers.poller';
import { ServersService } from './servers.service';

@Module({
  imports: [ConfigModule],
  controllers: [ServersController],
  providers: [
    ServersService,
    ServersGateway,
    ServersPoller,
    ArkStatusProvider,
    { provide: SERVER_PROVIDER, useExisting: ArkStatusProvider },
  ],
  exports: [ServersService, ServersGateway],
})
export class ServersModule {}
