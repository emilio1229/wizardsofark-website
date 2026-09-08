import type { ServerStatus } from '../types';
import { woaTokens } from '../theme/tokens';

export function getStatusColour(status: ServerStatus): string {
  switch (status) {
    case 'online':
      return woaTokens.colours.status.online;
    case 'offline':
      return woaTokens.colours.status.offline;
    case 'restarting':
      return woaTokens.colours.status.restarting;
    case 'maintenance':
      return woaTokens.colours.status.maintenance;
    default:
      return woaTokens.colours.text.muted;
  }
}

export function formatStatusLabel(status: ServerStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatPlayerCount(players: number, maxPlayers: number): string {
  return `${players} / ${maxPlayers}`;
}

export function formatUptime(seconds: number): string {
  if (seconds <= 0) {
    return '—';
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatEos(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
