import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ParsedServer } from "../types";
import { fetchArkStatusServerList } from "./arkstatus-client";
import { parseArkStatusServerList } from "./arkstatus-parser";
import { filterWoaServers } from "./server-filter";
import type { ServerProvider } from "./server-provider.interface";

@Injectable()
export class ArkStatusProvider implements ServerProvider {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  private get settings(): {
    baseUrl: string;
    apiKey: string;
    search: string;
    timeoutMs: number;
  } {
    return {
      baseUrl: String(
        this.configService.get<string>(
          "arkStatusBaseUrl",
          "https://arkstatus.com/api/v1",
        ),
      ),
      apiKey: this.configService.get<string>("arkStatusApiKey", ""),
      search: this.configService.get<string>(
        "serverNameFilter",
        "The Wizards Of Ark",
      ),
      timeoutMs: this.configService.get<number>("fetchTimeoutMs", 30_000),
    };
  }

  private async fetchAll(): Promise<{
    servers: ParsedServer[];
    skipped: number;
  }> {
    const { baseUrl, apiKey, search, timeoutMs } = this.settings;
    const payload = await fetchArkStatusServerList({
      baseUrl,
      apiKey,
      search,
      timeoutMs,
    });
    const { servers, skipped } = parseArkStatusServerList(payload);
    return {
      servers: filterWoaServers(servers, search),
      skipped,
    };
  }

  async fetchServers(): Promise<ParsedServer[]> {
    const { servers } = await this.fetchAll();
    return servers;
  }
}
