import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';
import jsonwebtoken from 'jsonwebtoken';
import { QueryFailedError } from 'typeorm';

import { logger } from '../../../shared/logger';
import { envVars } from '../../../shared/envVars';
import { registerUser } from '../auth.context';

import bcrypt from 'bcrypt';
import { UserRepo } from '../../../db';

interface AuthReq {
  body: {
    email: string;
    password: string;
  };
}

const InvalidAuthMessage = 'Invalid email or password';

export const logIn: AppRequestHandler<AuthReq> = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserRepo.get(email);
  if (!user) {
    throw boom.unauthorized(InvalidAuthMessage);
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordsMatch) {
    throw boom.unauthorized(InvalidAuthMessage);
  }

  const payload = {
    ['client_id']: user.email,
  };

  const token = jsonwebtoken.sign(payload, envVars.AUTH_KEY, {
    issuer: envVars.URL_BASE,
    audience: envVars.URL_BASE,
    expiresIn: envVars.AUTH_EXPIRATION_SEC,
  });

  return res.status(status.OK).send({
    accessToken: token,
    tokenType: 'Bearer',
    expiresAt: Math.trunc(Date.now() / 1000 + envVars.AUTH_EXPIRATION_SEC),
  });
};

export const signUp: AppRequestHandler<AuthReq> = async (req, res) => {
  const { email, password } = req.body;

  try {
    await registerUser(email, password);
  } catch (err) {
    if (err instanceof QueryFailedError) {
      // we quitely ignore this to not letting know potential attacker that given
      // email address already exist in our database
      res.status(status.CREATED).send();
    } else {
      throw err;
    }
  }

  logger.info(`New user account created: "${email}"`);

  return res.status(status.CREATED).send();
};
