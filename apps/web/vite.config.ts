import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@woa/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:3001',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
