import { useEffect, useState } from 'react';

export function formatRelativeTime(iso: string | null | undefined, nowMs = Date.now()): string {
  if (!iso) {
    return 'never';
  }

  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return 'unknown';
  }

  const deltaSeconds = Math.max(0, Math.round((nowMs - then) / 1000));
  if (deltaSeconds < 5) {
    return 'just now';
  }
  if (deltaSeconds < 60) {
    return `${deltaSeconds} second${deltaSeconds === 1 ? '' : 's'} ago`;
  }

  const minutes = Math.floor(deltaSeconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 48) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

/** Re-renders on an interval so relative timestamps stay fresh without refetching. */
export function useRelativeClock(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function formatUtilization(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  return `${Math.round(value * 100)}%`;
}

export function formatConnection(ip: string, gamePort: number, queryPort?: number | null): string {
  if (queryPort) {
    return `${ip}:${gamePort} (query ${queryPort})`;
  }
  return `${ip}:${gamePort}`;
}
