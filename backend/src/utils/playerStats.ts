export function calculatePlayerUtilization(
  players: number | null | undefined,
  maxPlayers: number | null | undefined,
): number | null {
  if (players === null || players === undefined || maxPlayers === null || maxPlayers === undefined) {
    return null;
  }
  if (!Number.isFinite(players) || !Number.isFinite(maxPlayers) || maxPlayers <= 0) {
    return null;
  }
  return Math.max(0, players) / maxPlayers;
}

export function summarisePlayers(
  servers: Array<{ players: number | null; maxPlayers: number | null; status: string }>,
): { currentPlayers: number; maxPlayers: number } {
  let currentPlayers = 0;
  let maxPlayers = 0;

  for (const server of servers) {
    if (server.status === 'online') {
      currentPlayers += server.players ?? 0;
    }
    maxPlayers += server.maxPlayers ?? 0;
  }

  return { currentPlayers, maxPlayers };
}
