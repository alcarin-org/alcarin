import { test } from './test';

export enum JobType {
  Test = 'test',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type JobHandler = (data: any) => Promise<string>;

function getJobHandler(jobType: string): JobHandler {
  switch (jobType) {
    case JobType.Test:
      return test;
    default:
      throw new Error(`Unsupported job type: ${jobType}`);
  }
}

export async function handleJob<TArgs>(
  jobType: string,
  data: TArgs
): Promise<string> {
  const handler = getJobHandler(jobType);
  return handler(data);
}
