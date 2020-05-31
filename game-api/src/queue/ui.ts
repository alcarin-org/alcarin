import BullArena from 'bull-arena';
import { RequestHandler, Router } from 'express';

import { envVars } from '../shared/envVars';

import { getRedisConfig } from './redis';
import { MainQueueName } from './main-queue';

const bullArena = BullArena(
  {
    queues: [
      {
        name: MainQueueName,
        hostId: envVars.REDIS_HOST,
        redis: getRedisConfig(),
      },
    ],
  },
  {
    basePath: '/',
    disableListen: true,
  }
);

const htmlContent: RequestHandler = (__, res, next) => {
  res.setHeader('Content-Type', 'text/html');
  next();
};

export const queueUiRouter = Router()
  .use(htmlContent)
  .use('/queue', bullArena);
