import { Router } from 'express';

import { asyncRequestHandler } from '../../shared/async-request-handler';

import { test } from './controllers/test.ctrl';

export const testRouter = Router();

testRouter.get('/test/test', asyncRequestHandler(test));
