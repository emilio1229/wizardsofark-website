import type { ParsedAsaServer } from '../types';

export interface ServerProvider {
  fetchServers(): Promise<ParsedAsaServer[]>;
}

export const SERVER_PROVIDER = Symbol('SERVER_PROVIDER');
