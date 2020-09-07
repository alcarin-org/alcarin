import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';
import { QueryFailedError } from 'typeorm';
import { accountModule } from 'src/module-storage';
import { logger } from 'src/helpers/logger';

interface AuthReq {
  body: {
    email: string;
    password: string;
  };
}

export const logIn: AppRequestHandler<AuthReq> = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await accountModule.loginWithPassword(email, password);
    logger.info(`User "${email}" logged in`);

    return res.status(status.OK).send(token);
  } catch (err) {
    throw boom.unauthorized(err.message);
  }
};

export const signUp: AppRequestHandler<AuthReq> = async (req, res) => {
  const { email, password } = req.body;

  try {
    await accountModule.registerWithPassword(email, password);
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
