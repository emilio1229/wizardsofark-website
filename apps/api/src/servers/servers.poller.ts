import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LOCK_STORE, type LockStore } from '../redis/lock-store.interface';
import { ServersGateway } from './servers.gateway';
import { ServersService } from './servers.service';

const POLL_LOCK_KEY = 'asa:poll';

@Injectable()
export class ServersPoller implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ServersPoller.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly serversService: ServersService,
    private readonly serversGateway: ServersGateway,
    private readonly configService: ConfigService,
    @Inject(LOCK_STORE) private readonly lockStore: LockStore,
  ) {}

  onModuleInit(): void {
    const intervalMs = this.configService.get<number>('arkServerPollIntervalMs', 60_000);
    // Do not await the first poll — Nest blocks listen()/health until onModuleInit
    // resolves, which trips Railway healthchecks when the ASA CDN is slow.
    this.timer = setInterval(() => {
      void this.runOnce();
    }, intervalMs);
    this.timer.unref?.();
    void this.runOnce();
    this.logger.log(`ASA poller started (interval=${intervalMs}ms)`);
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async runOnce(): Promise<void> {
    const acquired = await this.lockStore.acquire(POLL_LOCK_KEY, 55_000);
    if (!acquired) {
      this.logger.warn('Skipping overlapping ASA poll');
      return;
    }

    try {
      const result = await this.serversService.pollOnce();
      if (result.ok) {
        if (result.changes.length > 0) {
          this.logger.log(
            `ASA poll completed: matched=${result.matched} skipped=${result.skipped} changes=${result.changes.length}`,
          );
          await this.serversGateway.emitMeaningfulChanges(result.changes);
        } else {
          this.logger.debug(
            `ASA poll completed with no meaningful changes (matched=${result.matched})`,
          );
        }
      } else {
        this.logger.error(`ASA poll failed; retaining prior server states: ${result.error}`);
      }
    } catch (error) {
      this.logger.error('Unexpected ASA poller failure', error instanceof Error ? error.stack : undefined);
    } finally {
      await this.lockStore.release(POLL_LOCK_KEY);
    }
  }
}
