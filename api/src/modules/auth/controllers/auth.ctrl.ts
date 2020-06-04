import { AppRequestHandler } from 'express';
import status from 'http-status-codes';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import { logger } from '../../../shared/logger';
import { envVars } from '../../../shared/envVars';
import { UserRepo } from '../../../db';

interface SignUpReq {
  body: {
    email: string;
    password: string;
  };
}

export const logIn: AppRequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(501).send({ error: 'No user provided' });
  }

  const payload = {
    email: req.user.email,
  };

  const token = jsonwebtoken.sign(payload, envVars.AUTH_KEY, {
    issuer: envVars.URL_BASE,
    audience: envVars.URL_BASE,
    expiresIn: envVars.AUTH_EXPIRATION_SEC,
  });

  return res.status(status.OK).send({
    ['access_token']: token,
    ['token_type']: 'Bearer',
    ['expires_at']: Date.now() / 1000 + envVars.AUTH_EXPIRATION_SEC,
  });
};

export const signUp: AppRequestHandler<SignUpReq> = async (req, res) => {
  const { email, password } = req.body;

  const hashCost: number = envVars.BCRYPT_ROUNDS;

  const passwordHash = await bcrypt.hash(password, hashCost);
  await UserRepo.register(email, passwordHash);

  logger.info(`New user account created: "${email}"`);

  return res.status(status.CREATED).send();
};
