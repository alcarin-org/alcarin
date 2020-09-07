import { AppRequestConfig, AppRequestHandler } from 'express';
import async from 'express-async-handler';

// TODO: add explanation
export function asyncRequestHandler<Config extends AppRequestConfig>(
  handler: AppRequestHandler<Config>
) {
  return ((async as unknown) as (
    callback: AppRequestHandler<Config>
  ) => AppRequestHandler<Config>)(handler);
}
