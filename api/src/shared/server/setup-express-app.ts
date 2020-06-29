import express from 'express';
import logger from 'morgan';
import passport from 'passport';
import cors from 'cors';

import { preloadEntityStorage } from '../../middleware/preload-entity.middleware';
import { loadPassportStrategies } from '../../modules/auth/passport-jwt-setup';
import { queueUiRouter } from '../../queue/ui';
import { boomErrorsHandler } from '../../middleware/boom-errors-handler.middleware';
import { envVars } from '../env-vars';

import { handleValidationError, openApiValidator } from './openapi';
import { setupRoutes } from './setup-routes';
import { jsonApi } from './json-api';

export { setupExpressApp };

async function setupExpressApp() {
  const app = express();

  app.use(logger('dev'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(preloadEntityStorage());
  app.use(jsonApi());
  app.use(passport.initialize());

  loadPassportStrategies();
  app.use(
    cors({
      origin: envVars.WEB_BASE_URL,
    })
  );
  await openApiValidator.install(app);

  app.use('/', setupRoutes());
  app.use(handleValidationError());
  app.use(queueUiRouter);

  app.use(boomErrorsHandler);

  return app;
}
