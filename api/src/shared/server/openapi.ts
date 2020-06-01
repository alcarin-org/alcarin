import { ErrorRequestHandler } from 'express';
import { OpenApiValidator } from 'express-openapi-validator';
import status from 'http-status-codes';

import { isTest } from '../../shared/envVars';

export const openApiValidator = new OpenApiValidator({
  apiSpec: './openapi.yml',
  validateRequests: true,
  validateResponses: isTest(),
});

export function handleValidationError(): ErrorRequestHandler {
  return function validationErrorHandler(err, req, res, next) {
    if (err.path) {
      const errRes = {
        message: err.message,
        errors: err.errors,
      };
      if (isTest()) {
        console.log('BadRequest', errRes);
      }
      res.status(status.BAD_REQUEST).json(errRes);
    } else {
      next(err);
    }
  };
}
