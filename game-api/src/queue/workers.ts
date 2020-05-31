import { Job, Worker } from 'bullmq';

import { getRedisConfig } from './redis';
import { handleJob } from './jobs';
import { MainQueueName } from './main-queue';

export async function createMainQueueWorker() {
  const config = getRedisConfig();
  return new Worker(MainQueueName, mainQueueWorker, {
    connection: config,
  });
}

function mainQueueWorker(job: Job) {
  return handleJob(job.name, job.data);
}
