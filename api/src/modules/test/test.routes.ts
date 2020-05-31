import { Router } from 'express';

import { asyncRequestHandler } from '../../shared/async-request-handler';
import { validateReq } from '../../shared/server/openapi';

import { test } from './controllers/test.ctrl';

export const testRouter = Router();

testRouter.get(
  '/test/test',
  validateReq('get', '/test/test'),
  asyncRequestHandler(test)
);
