import { NextFunction, AppRequest, Response } from 'express';
import boom from '@hapi/boom';
import { accountModule } from 'src/module-storage';

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
      req.accountId = await accountModule.isSessionValid(token);
      return next();
    } catch (err) {
      return next(boom.unauthorized('Invalid authorization token'));
    }
  }

  return next(boom.unauthorized('No authorization token provided'));
}
