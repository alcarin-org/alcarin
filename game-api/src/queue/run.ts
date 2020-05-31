import { Worker } from 'bullmq';

import { createDatabaseConnection } from '../db';
import { logger } from '../shared/logger';

import { createMainQueueWorker } from './workers';

run();

async function run() {
  await createDatabaseConnection();

  const worker = await createMainQueueWorker();
  setupLogging(worker);

  logger.queue('Queue worker started, listening for jobs');
}

function setupLogging(worker: Worker) {
  worker.on('active', ({ id, name }) => {
    logger.queue(`Activate job "${name}:${id}"`);
  });

  worker.on('completed', ({ id, name, returnvalue }) => {
    logger.queue(`Job '${name}:${id}' done. (return: "${returnvalue}")`);
  });

  worker.on('failed', ({ id, name, failedReason }, err) => {
    logger.warn(`Job "${name}:${id}" failed, reason: "${failedReason}"`, err);
  });
}
