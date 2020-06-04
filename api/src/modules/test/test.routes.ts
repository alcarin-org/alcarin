import { Router } from 'express';
import passport from 'passport';

import { asyncRequestHandler } from '../../shared/async-request-handler';

import { test } from './controllers/test.ctrl';

console.log(passport);
export const testRouter = Router();

testRouter.get(
  '/test/test',
  passport.authenticate('basic', { session: false }),
  asyncRequestHandler(test)
);
