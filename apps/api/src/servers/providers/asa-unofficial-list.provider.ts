import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfiguration } from '../../config/configuration';
import type { ParsedAsaServer } from '../types';
import { fetchAsaUnofficialServerList } from './asa-client';
import { parseAsaServerList } from './asa-parser';
import { filterWoaServers } from './server-filter';
import type { ServerProvider } from './server-provider.interface';

@Injectable()
export class AsaUnofficialListProvider implements ServerProvider {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  private get config(): AppConfiguration {
    return {
      nodeEnv: this.configService.get<string>('nodeEnv', 'development'),
      port: this.configService.get<number>('port', 3001),
      host: this.configService.get<string>('host', '0.0.0.0'),
      databaseUrl: this.configService.get<string>('databaseUrl', ''),
      frontendUrl: this.configService.get<string>('frontendUrl', ''),
      corsOrigin: this.configService.get<string>('corsOrigin', '*'),
      arkApiUrl: this.configService.get<string>(
        'arkApiUrl',
        'https://cdn2.arkdedicated.com/servers/asa/unofficialserverlist.json',
      ),
      serverNameFilter: this.configService.get<string>(
        'serverNameFilter',
        'The Wizards Of Ark',
      ),
      arkServerPollIntervalMs: this.configService.get<number>(
        'arkServerPollIntervalMs',
        60_000,
      ),
      restartingThresholdSeconds: this.configService.get<number>(
        'restartingThresholdSeconds',
        180,
      ),
      offlineThresholdSeconds: this.configService.get<number>(
        'offlineThresholdSeconds',
        600,
      ),
      cacheTtlSeconds: this.configService.get<number>('cacheTtlSeconds', 45),
      asaFetchTimeoutMs: this.configService.get<number>('asaFetchTimeoutMs', 30_000),
      masterListStaleSeconds: this.configService.get<number>(
        'masterListStaleSeconds',
        180,
      ),
      mapOrder: this.configService.get<string[]>('mapOrder', []),
      redisUrl: this.configService.get<string | null>('redisUrl', null),
    };
  }

  async fetchServers(): Promise<ParsedAsaServer[]> {
    const cfg = this.config;
    const payload = await fetchAsaUnofficialServerList({
      url: cfg.arkApiUrl,
      timeoutMs: cfg.asaFetchTimeoutMs,
    });
    const { servers } = parseAsaServerList(payload);
    return filterWoaServers(servers, cfg.serverNameFilter);
  }

  async fetchWithStats(): Promise<{ servers: ParsedAsaServer[]; skipped: number }> {
    const cfg = this.config;
    const payload = await fetchAsaUnofficialServerList({
      url: cfg.arkApiUrl,
      timeoutMs: cfg.asaFetchTimeoutMs,
    });
    const { servers, skipped } = parseAsaServerList(payload);
    return {
      servers: filterWoaServers(servers, cfg.serverNameFilter),
      skipped,
    };
  }
}
