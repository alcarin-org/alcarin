import { Router } from 'express';

import { asyncRequestHandler } from '../../shared/async-request-handler';

import { createNewCharacter } from './controllers/character.ctrl';

export const characterRouter = Router();

characterRouter.post(
  'characters/create',
  asyncRequestHandler(createNewCharacter)
);
