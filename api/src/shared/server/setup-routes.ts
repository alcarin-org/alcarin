import { Router } from 'express';

import { testRouter } from '../../modules/test/test.routes';
import { authRouter } from '../../modules/auth/auth.routes';
import { characterRouter } from '../../modules/characters/character.routes';

export function setupRoutes() {
  const mainRouter = Router();

  mainRouter.use(testRouter);
  mainRouter.use(authRouter);
  mainRouter.use(characterRouter);

  mainRouter.get('/healthz', (_req, res) => res.status(200).send());

  return mainRouter;
}
