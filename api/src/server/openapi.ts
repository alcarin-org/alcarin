import path from 'path';

import { ErrorRequestHandler } from 'express';
import { OpenApiValidator } from 'express-openapi-validator';
import status from 'http-status-codes';

import { isTest } from './env-vars';

export const openApiValidator = new OpenApiValidator({
  apiSpec: path.join(__dirname, '../../', 'openapi.yml'),
  validateRequests: true,
  validateResponses: isTest(),
  ignorePaths: /.*\/queue\/.*$/,
});

export function handleValidationError(): ErrorRequestHandler {
  return function validationErrorHandler(err, req, res, next) {
    if (err.path) {
      const errRes = {
        message: 'OpenAPI: ' + err.message,
        errors: err.errors,
      };
      if (isTest()) {
        console.log('OpenAPI: BadRequest', errRes);
      }
      res.status(status.BAD_REQUEST).json(errRes);
    } else {
      next(err);
    }
  };
}
