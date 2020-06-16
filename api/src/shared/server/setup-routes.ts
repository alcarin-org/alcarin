import { Router } from 'express';

import { testRouter } from '../../modules/test/test.routes';
import { authRouter } from '../../modules/auth/auth.routes';

export function setupRoutes() {
  const mainRouter = Router();

  mainRouter.use(testRouter);
  mainRouter.use(authRouter);

  mainRouter.get('/healthz', (_req, res) => res.status(200).send());

  return mainRouter;
}
