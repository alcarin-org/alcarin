import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';
import { QueryFailedError } from 'typeorm';
import { logger } from '@/server/core/helpers/logger';
import { envVars } from '@/server/core/env-vars';
import { login, register } from '@/server/services/account-access.service';

import { TokenType } from '../middleware/verify-token.middleware';

export { TokenType };

interface AuthReq {
  body: {
    email: string;
    password: string;
  };
}

export const logIn: AppRequestHandler<AuthReq> = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await login(email, password);
    logger.info(`User "${email}" logged in`);

    return res.status(status.OK).send({
      accessToken: token,
      tokenType: TokenType,
      expiresAt: Math.trunc(Date.now() / 1000 + envVars.AUTH_EXPIRATION_SEC),
    });
  } catch (err) {
    throw boom.unauthorized(err.message);
  }
};

export const signUp: AppRequestHandler<AuthReq> = async (req, res) => {
  const { email, password } = req.body;

  try {
    await register(email, password);
  } catch (err) {
    if (err instanceof QueryFailedError) {
      // we quietly ignore this to not letting know potential attacker that given
      // email address already exist in our database
      logger.info(`cannot create user`);

      res.status(status.NO_CONTENT).send();
    } else {
      throw err;
    }
  }

  logger.info(`New user account created: "${email}"`);

  return res.status(status.NO_CONTENT).send();
};
