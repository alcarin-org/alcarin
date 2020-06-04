import { Router } from 'express';

import { asyncRequestHandler } from '../../shared/async-request-handler';

import { logIn, signUp } from './controllers/auth.ctrl';

export const authRouter = Router();

authRouter.post('/session', asyncRequestHandler(logIn));

authRouter.post('/users', asyncRequestHandler(signUp));
