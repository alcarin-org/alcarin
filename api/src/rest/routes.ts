import { Router } from 'express';

import { asyncRequestHandler } from './async-request-handler';
import { verifyTokenMiddleware } from './middleware/verify-token.middleware';
import { logIn, signUp } from './controllers/auth.ctrl';
import {
  createNewCharacter,
  findCharactersForUsers,
} from './controllers/character.ctrl';
import { test } from './controllers/test.ctrl';

/** AUTH **/
export const authRouter = Router();
authRouter.post('/session', asyncRequestHandler(logIn));
authRouter.post('/users', asyncRequestHandler(signUp));

/** Characters **/
export const characterRouter = Router();

characterRouter.post(
  '/users/current/characters',
  verifyTokenMiddleware,
  asyncRequestHandler(createNewCharacter)
);

characterRouter.get(
  '/users/current/characters',
  verifyTokenMiddleware,
  asyncRequestHandler(findCharactersForUsers)
);

/** TEST **/
export const testRouter = Router();

testRouter.get('/test/test', asyncRequestHandler(test));
