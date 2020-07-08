import IORedis from 'ioredis';
import { Queue, QueueScheduler } from 'bullmq';

import { isProduction } from 'src/server/core/env-vars';

import { getRedisConfig } from './redis';

const QueueJobOptions = isProduction()
  ? {
      attempts: 5,
      backoff: {
        // delay: Math.pow(2, attemptsMade) - 1) * delay
        // 5x tries, last one waiting a 15 minutes.
        // on production the apis can got jam because of gmail api usage limits
        type: 'exponential',
        delay: 30000,
      },
    }
  : { attempts: 1 };

export const MainQueueName = 'main-queue';

export function setupMainQueue() {
  const redis = new IORedis(getRedisConfig());
  const mainQueue = new Queue(MainQueueName, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: false,
      ...QueueJobOptions,
    },
  });

  const mainScheduler = new QueueScheduler(MainQueueName, {
    connection: new IORedis(getRedisConfig()),
  });

  return { redis, queue: mainQueue, scheduler: mainScheduler };
}
