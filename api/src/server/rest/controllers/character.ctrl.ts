import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';

import { logger } from 'src/server/core/helpers/logger';
import {
  createCharacter,
  getCharacters,
} from 'src/server/services/account-access.service';
import { AvailableRace } from 'src/server/plugins/game/races/available-race-provider';

interface CreateNewCharacterReq {
  body: {
    name: string;
    race: AvailableRace;
  };
}

interface OneCharacterPayload {
  params: {
    characterId: string;
  };
}

export const createNewCharacter: AppRequestHandler<CreateNewCharacterReq> = async (
  req,
  res
) => {
  const { name, race } = req.body;
  const user = req.user;

  try {
    const character = await createCharacter(user, name, race);
    logger.info(`Character "${name} with race ${race}" created`);

    return res.status(status.CREATED).send(character);
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};

export const findCharactersForUsers: AppRequestHandler = async (req, res) => {
  const accountId = req.accountId;

  try {
    const characters = await getCharacters(accountId);

    return res.status(status.OK).send(characters);
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};
