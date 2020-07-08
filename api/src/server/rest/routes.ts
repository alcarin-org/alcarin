import { Router } from 'express';

import { asyncRequestHandler } from 'src/server/core/helpers/async-request-handler';
import { jwtAuthenticate } from './plugins/passport/jwt-passport-authentication';
import { logIn, signUp } from './controllers/auth.ctrl';
import {
  createNewCharacter,
  findCharactersForUsers
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
  jwtAuthenticate,
  asyncRequestHandler(createNewCharacter)
);

characterRouter.get(
  '/users/current/characters',
  jwtAuthenticate,
  asyncRequestHandler(findCharactersForUsers)
);

/** TEST **/
export const testRouter = Router();

testRouter.get('/test/test', asyncRequestHandler(test));
