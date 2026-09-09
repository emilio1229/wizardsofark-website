import { Global, Module } from '@nestjs/common';
import { CACHE_STORE } from './cache-store.interface';
import { LOCK_STORE } from './lock-store.interface';
import { InMemoryCacheStore } from './in-memory-cache.store';
import { InMemoryLockStore } from './in-memory-lock.store';

@Global()
@Module({
  providers: [
    InMemoryCacheStore,
    InMemoryLockStore,
    { provide: CACHE_STORE, useExisting: InMemoryCacheStore },
    { provide: LOCK_STORE, useExisting: InMemoryLockStore },
  ],
  exports: [CACHE_STORE, LOCK_STORE, InMemoryCacheStore, InMemoryLockStore],
})
export class RedisModule {}
