import { Module } from '@nestjs/common';
import { AsaUnofficialListProvider } from './providers/asa-unofficial-list.provider';
import { SERVER_PROVIDER } from './providers/server-provider.interface';
import { ServersController } from './servers.controller';
import { ServersGateway } from './servers.gateway';
import { ServersPoller } from './servers.poller';
import { ServersService } from './servers.service';

@Module({
  controllers: [ServersController],
  providers: [
    ServersService,
    ServersGateway,
    ServersPoller,
    AsaUnofficialListProvider,
    { provide: SERVER_PROVIDER, useExisting: AsaUnofficialListProvider },
  ],
  exports: [ServersService, ServersGateway],
})
export class ServersModule {}
