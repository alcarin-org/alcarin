import { Router } from 'express';
import { characterRouter, authRouter, testRouter } from '@/server/rest/routes';

export function setupRoutes() {
  const mainRouter = Router();

  mainRouter.use(testRouter);
  mainRouter.use(authRouter);
  mainRouter.use(characterRouter);

  mainRouter.get('/healthz', (_req, res) => res.status(200).send());

  return mainRouter;
}
