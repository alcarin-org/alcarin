import { verifyToken } from '@/server/services/account-access.service';
import { NextFunction, AppRequest, Response } from 'express';
export const TokenType = 'Bearer';

export async function verifyTokenMiddleware(
  req: AppRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (
    auth !== undefined &&
    auth.substring(0, TokenType.length + 1) === `${TokenType} `
  ) {
    try {
      const payload = await verifyToken(auth.replace('Bearer ', ''));
      req.accountId = payload.accountId;
      return next();
    } catch (err) {
      return res.status(401).json();
    }
  }

  return res.status(401).json();
}
