import fs from 'fs';

import { ErrorRequestHandler } from 'express';
import { OpenApiValidator, ValidationError } from 'express-openapi-validate';
import jsYaml from 'js-yaml';

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync('./openapi.yml', 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument);

export const validateReq = validator.validate.bind(validator);
export const validateRes = validator.validateResponse.bind(validator);

export function handleValidationError(): ErrorRequestHandler {
  return function validationErrorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode || 500).json({
        error: {
          name: err.name,
          message: err.message,
          data: err.data,
        },
      });
    } else {
      next(err);
    }
  };
}
