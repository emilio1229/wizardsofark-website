import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { WS_EVENTS } from '@woa/shared';
import { apiSlice } from './api/apiSlice';
import { useAppDispatch } from './hooks';

function resolveWsUrl(): string {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://127.0.0.1:3001';
}

/** Subscribe to NestJS Socket.IO server events and invalidate RTK Query caches. */
export function useServerLiveUpdates(): void {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(resolveWsUrl(), {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    socketRef.current = socket;

    const invalidate = () => {
      dispatch(apiSlice.util.invalidateTags(['Servers', 'Server']));
    };

    socket.on(WS_EVENTS.SERVERS_UPDATED, invalidate);
    socket.on(WS_EVENTS.SERVER_UPDATED, invalidate);
    socket.on(WS_EVENTS.SERVER_ONLINE, invalidate);
    socket.on(WS_EVENTS.SERVER_OFFLINE, invalidate);
    socket.on(WS_EVENTS.SERVER_PLAYER_COUNT_CHANGED, invalidate);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch]);
}
