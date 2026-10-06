import type { ParsedServer } from '../types';

export interface ServerProvider {
  fetchServers(): Promise<ParsedServer[]>;
}

export const SERVER_PROVIDER = Symbol('SERVER_PROVIDER');
