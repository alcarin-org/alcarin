import { Router } from 'express';
import passport from 'passport';

import { asyncRequestHandler } from '../../shared/async-request-handler';

import { logIn, signUp } from './controllers/auth.ctrl';

export const authRouter = Router();

authRouter.get(
  '/auth/login',
  passport.authenticate('local'),
  asyncRequestHandler(logIn)
);

authRouter.get('/auth/sign-up', asyncRequestHandler(signUp));
