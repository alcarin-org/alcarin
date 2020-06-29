import { Router } from 'express';

import { asyncRequestHandler } from '../../shared/async-request-handler';
import { jwtAuthenticate } from '../../middleware/passport-jwt-authenticate.middleware';

import {
  createNewCharacter,
  findCharactersForUsers,
  findOneCharacter,
} from './controllers/character.ctrl';

export const characterSubRouter = Router();
export const characterRouter = Router();

characterSubRouter.post('/', asyncRequestHandler(createNewCharacter));
characterSubRouter.get('/', asyncRequestHandler(findCharactersForUsers));
characterSubRouter.get('/:characterId', asyncRequestHandler(findOneCharacter));

characterRouter.use(
  '/users/current/characters',
  jwtAuthenticate,
  characterSubRouter
);
