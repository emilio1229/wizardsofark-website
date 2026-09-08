import type { ServerService } from '../server/serverService.js';

export type Poller = {
  start: () => Promise<void>;
  stop: () => void;
};

export function createServerPoller(
  service: ServerService,
  options: {
    intervalSeconds: number;
    logger?: {
      info: (obj: unknown, msg?: string) => void;
      error: (obj: unknown, msg?: string) => void;
      warn: (obj: unknown, msg?: string) => void;
    };
  },
): Poller {
  let timer: NodeJS.Timeout | null = null;
  let running = false;

  const run = async () => {
    if (running) {
      options.logger?.warn({}, 'Skipping overlapping ASA poll');
      return;
    }
    running = true;
    try {
      const result = await service.pollOnce();
      if (result.ok) {
        options.logger?.info(
          { matched: result.matched, skipped: result.skipped },
          'ASA poll completed',
        );
      } else {
        options.logger?.error({ err: result.error }, 'ASA poll failed; retaining prior server states');
      }
    } catch (error) {
      options.logger?.error({ err: error }, 'Unexpected ASA poller failure');
    } finally {
      running = false;
    }
  };

  return {
    start: async () => {
      await run();
      timer = setInterval(() => {
        void run();
      }, options.intervalSeconds * 1000);
      timer.unref?.();
    },
    stop: () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
  };
}
