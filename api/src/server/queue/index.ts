import { logger } from 'src/server/core/helpers/logger';

import { JobType } from './jobs';
import { setupMainQueue } from './main-queue';

const { queue: mainQueue, redis: queueRedis, scheduler } = setupMainQueue();

export const redis = queueRedis;

export const MainScheduler = scheduler;

export const MainQueue = {
  queueTest: async () => {
    await mainQueue.add(JobType.Test, {});

    logger.queue(`Test queued for sync`);
  },
};
