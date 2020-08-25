import { NextFunction, AppRequest, Response } from 'express';
import boom from '@hapi/boom';
import { verifyToken } from '@/alcarin/authorization';

export async function verifyTokenMiddleware(
  req: AppRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (auth !== undefined) {
    const [tokenType, token] = auth.split(' ').map(val => val.trim());
    if (tokenType !== 'Bearer') {
      return next(boom.unauthorized('Invalid authorization token type'));
    }

    try {
      const payload = await verifyToken(token);
      req.accountId = payload.accountId;
      return next();
    } catch (err) {
      return next(boom.unauthorized('Invalid authorization token'));
    }
  }

  return next(boom.unauthorized('No authorization token provided'));
}
