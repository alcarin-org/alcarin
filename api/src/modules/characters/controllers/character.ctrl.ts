import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';

import { logger } from '../../../shared/logger';
import { createNewCharacterForUser } from '../characters.context';

interface CreateNewCharacterReq {
  body: {
    name: string;
    race: string;
  };
}
export const createNewCharacter: AppRequestHandler<CreateNewCharacterReq> = async (
  req,
  res
) => {
  const { name, race } = req.body;
  const user = req.user;

  try {
    const character = await createNewCharacterForUser(user, name, race);
    logger.info(`Character "${name} with race ${character.race}" created`);

    return res.status(status.OK).send({ id: character.id });
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};
