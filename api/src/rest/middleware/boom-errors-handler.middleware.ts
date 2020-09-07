import { Boom, boomify } from '@hapi/boom';
import { NextFunction, AppRequest, Response } from 'express';

import { logger } from '../../helpers/logger';
import { isProduction } from '../../server/env-vars';

type Headers = Record<string, string>;

export function boomErrorsHandler(
  err: Boom | Error,
  req: AppRequest,
  res: Response,
  _next: NextFunction
) {
  const error = err instanceof Boom ? err : boomify(err);
  error.reformat(!isProduction());
  const { output, data } = error;
  const headers: Headers = output.headers as Headers;
  Object.keys(headers).forEach(headerName =>
    res.header(headerName, headers[headerName])
  );

  logger.error(err);

  res.status(output.statusCode);

  return isProduction()
    ? res.send(output.payload)
    : res.send({ ...output.payload, data });
}
