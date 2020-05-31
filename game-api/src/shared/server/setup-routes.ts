import { Router } from 'express';

import { testRouter } from '../../modules/test/test.routes';

export function setupRoutes() {
  const mainRouter = Router();

  mainRouter.use(testRouter);

  mainRouter.get('/healthz', (_req, res) => res.status(200).send());

  return mainRouter;
}
