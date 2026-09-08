export function matchesServerNameFilter(
  serverName: string | null | undefined,
  filter: string,
): boolean {
  const name = (serverName ?? '').trim().toLowerCase();
  const needle = filter.trim().toLowerCase();
  if (!name || !needle) {
    return false;
  }
  return name.includes(needle);
}

export function filterWoaServers<T extends { name: string; sessionName?: string | null }>(
  servers: T[],
  filter: string,
): T[] {
  return servers.filter(
    (server) =>
      matchesServerNameFilter(server.name, filter) ||
      matchesServerNameFilter(server.sessionName, filter),
  );
}
