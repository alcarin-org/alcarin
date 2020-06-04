// import Joi from '@hapi/joi';

// const envVarsSchema = Joi.object({
//   NODE_ENV: Joi.string()
//     .valid('production', 'development', 'test')
//     .required(),
//   PORT: Joi.number()
//     .integer()
//     .min(1025)
//     .max(65535)
//     .required(),
//   URL_BASE: Joi.string()
//     .uri()
//     .required(),
//   LOG_LEVEL: Joi.string().required(),
//   FIRST_SYNC_DISABLED: Joi.boolean().required(),
//   WIZARD_APP_URL: Joi.string()
//     .uri()
//     .required(),

//   DB_HOST: Joi.string().required(),
//   DB_PORT: Joi.number()
//     .integer()
//     .required(),
//   DB_USERNAME: Joi.string().required(),
//   DB_PASSWORD: Joi.string()
//     .allow('')
//     .required(),
//   DB_LOGGING: Joi.boolean().required(),
//   DB_DATABASE: Joi.string().required(),
//   TEST_DATABASE: Joi.string().required(),

//   GOOGLE_CLIENT_ID: Joi.string().required(),
//   GOOGLE_CLIENT_SECRET: Joi.string().required(),
//   APPS_SCRIPT_GOOGLE_CLOUD_CLIENT_ID: Joi.string().required(),

//   PUB_SUB_TOPIC: Joi.string().required(),
//   PUB_SUB_SUBSCRIPTION: Joi.string().required(),
//   PUB_SUB_SERVICE_ACCOUNT_EMAIL: Joi.string().required(),
//   PUB_SUB_SERVICE_ACCOUNT_ID: Joi.string().required(),

//   REDIS_PORT: Joi.number().required(),
//   REDIS_HOST: Joi.string().required(),
//   REDIS_DB: Joi.string()
//     .valid('0', '1')
//     .required(),
//   REDIS_USE_TLS: Joi.string()
//     .valid('0', '1')
//     .required(),

//   QUEUE_UI_USER: Joi.string().required(),
//   QUEUE_UI_PASSWORD: Joi.string().required(),
// })
//   .unknown(false)
//   .required();

export const envVars = {
  NODE_ENV: process.env.NODE_ENV as 'production' | 'development' | 'test',
  PORT: Number(process.env.PORT) || 8080,
  URL_BASE: process.env.URL_BASE as string,
  LOG_LEVEL: process.env.LOG_LEVEL as string,

  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_LOGGING: process.env.DB_LOGGING === 'true',
  DB_DATABASE: process.env.DB_DATABASE as string,

  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_DB: process.env.REDIS_DB || '0',
  REDIS_USE_TLS: (process.env.REDIS_USE_TLS || '0') as '0' | '1',

  QUEUE_UI_USER: process.env.QUEUE_UI_USER || 'admin',
  QUEUE_UI_PASSWORD: process.env.QUEUE_UI_PASSWORD || 'admin',

  AUTH_KEY: process.env.AUTH_KEY || '',
  // add proper validation
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  AUTH_EXPIRATION_SEC: parseInt(process.env.AUTH_EXPIRATION_SEC || '3600'),
};

// export function validateEnvVars() {
//   const errors = envVarsSchema.validate(envVars);

//   if (errors && errors.error && errors.error.message) {
//     throw new Error(errors.error.message);
//   }
// }

export const isTest = () => envVars.NODE_ENV === 'test';
export const isDevelopment = () => envVars.NODE_ENV === 'development';
export const isProduction = () => envVars.NODE_ENV === 'production';
