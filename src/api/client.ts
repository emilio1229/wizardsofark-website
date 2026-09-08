import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ApiResult<T> =
  | { status: 'success'; data: T; updatedAt: string }
  | { status: 'error'; error: Error; data?: T; updatedAt?: string };
