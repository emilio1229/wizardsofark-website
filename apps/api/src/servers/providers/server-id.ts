/**
 * Stable server identity derived from the connection address.
 *
 * The id is `ip:port` rather than the upstream's own numeric id so that it
 * stays stable across source changes and survives temporary absence from the
 * server list (a server going offline and returning keeps the same row).
 */
export function buildServerId(ip: string, gamePort: number): string {
  return `${ip}:${gamePort}`;
}
