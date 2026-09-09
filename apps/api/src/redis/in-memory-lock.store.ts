import { Injectable } from '@nestjs/common';
import type { LockStore } from './lock-store.interface';

type LockEntry = {
  expiresAt: number;
};

@Injectable()
export class InMemoryLockStore implements LockStore {
  private readonly locks = new Map<string, LockEntry>();

  async acquire(key: string, ttlMs: number): Promise<boolean> {
    const now = Date.now();
    const existing = this.locks.get(key);
    if (existing && existing.expiresAt > now) {
      return false;
    }
    this.locks.set(key, { expiresAt: now + ttlMs });
    return true;
  }

  async release(key: string): Promise<void> {
    this.locks.delete(key);
  }
}
