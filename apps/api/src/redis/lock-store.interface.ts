export const LOCK_STORE = Symbol('LOCK_STORE');

export interface LockStore {
  acquire(key: string, ttlMs: number): Promise<boolean>;
  release(key: string): Promise<void>;
}
