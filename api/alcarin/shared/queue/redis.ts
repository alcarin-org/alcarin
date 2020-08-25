import IORedis from 'ioredis';
import { envVars, isTest } from '../../../src/server/core/env-vars';

export const redis = new IORedis(getRedisConfig());

export function getRedisConfig() {
  const options = {
    port: envVars.REDIS_PORT,
    host: envVars.REDIS_HOST,
    db: getRedisDatabase(),
  };
  return envVars.REDIS_USE_TLS === '1' ? { tls: {}, ...options } : options;
}

function getRedisDatabase() {
  const fallbackDatabase = isTest() ? '1' : '0';
  return Number(envVars.REDIS_DB || fallbackDatabase);
}
