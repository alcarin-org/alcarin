import Joi from '@hapi/joi';

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test')
    .required(),
  PORT: Joi.number()
    .integer()
    .min(1025)
    .max(65535)
    .required(),
  URL_BASE: Joi.string()
    .uri()
    .required(),
  LOG_LEVEL: Joi.string()
    .valid(
      'debug',
      'info',
      'notice',
      'warning',
      'error',
      'crit',
      'alert',
      'emerg'
    )
    .required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number()
    .integer()
    .required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string()
    .allow('')
    .required(),
  DB_LOGGING: Joi.boolean().required(),
  DB_DATABASE: Joi.string().required(),

  REDIS_PORT: Joi.number().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_DB: Joi.string()
    .valid('0', '1')
    .required(),
  REDIS_USE_TLS: Joi.string()
    .valid('0', '1')
    .required(),

  QUEUE_UI_USER: Joi.string().required(),
  QUEUE_UI_PASSWORD: Joi.string().required(),

  AUTH_KEY: Joi.string()
    .min(32)
    .required(),
  BCRYPT_ROUNDS: Joi.number()
    .min(1)
    .max(20)
    .required(),
  AUTH_EXPIRATION_SEC: Joi.number()
    .positive()
    .required(),
})
  .unknown(false)
  .required();

export const envVars = {
  NODE_ENV: process.env.NODE_ENV || '',
  PORT: parseEnvNumber('PORT', 8080),
  URL_BASE: process.env.URL_BASE || '',
  LOG_LEVEL: process.env.LOG_LEVEL || '',

  DB_HOST: process.env.DB_HOST || '',
  DB_PORT: parseEnvNumber('DB_PORT', 5432),
  DB_USERNAME: process.env.DB_USERNAME || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_LOGGING: process.env.DB_LOGGING === 'true',
  DB_DATABASE: process.env.DB_DATABASE || '',

  REDIS_PORT: parseEnvNumber('REDIS_PORT', 6379),
  REDIS_HOST: process.env.REDIS_HOST || '',
  REDIS_DB: process.env.REDIS_DB || '0',
  REDIS_USE_TLS: process.env.REDIS_USE_TLS || '0',

  QUEUE_UI_USER: process.env.QUEUE_UI_USER || 'admin',
  QUEUE_UI_PASSWORD: process.env.QUEUE_UI_PASSWORD || 'admin',

  AUTH_KEY: process.env.AUTH_KEY || '',
  // add proper validation
  BCRYPT_ROUNDS: parseEnvNumber('BCRYPT_ROUNDS', 12),
  AUTH_EXPIRATION_SEC: parseEnvNumber('AUTH_EXPIRATION_SEC', 3600),
};

function parseEnvNumber(key: string, defaultVal: number) {
  const rawValue = process.env[key];
  return rawValue ? parseInt(rawValue) || defaultVal : defaultVal;
}

export function validateEnvVars() {
  const errors = envVarsSchema.validate(envVars);

  if (errors && errors.error && errors.error.message) {
    throw new Error(errors.error.message);
  }
}

export const isTest = () => envVars.NODE_ENV === 'test';
export const isDevelopment = () => envVars.NODE_ENV === 'development';
export const isProduction = () => envVars.NODE_ENV === 'production';
