export type ApiResult<T> =
  | { status: 'success'; data: T; updatedAt: string }
  | { status: 'error'; error: Error; data?: T; updatedAt?: string };

export function okResult<T>(data: T): ApiResult<T> {
  return { status: 'success', data, updatedAt: new Date().toISOString() };
}

export function errorResult(error: unknown): ApiResult<never> {
  return {
    status: 'error',
    error: error instanceof Error ? error : new Error(String(error)),
    updatedAt: new Date().toISOString(),
  };
}
