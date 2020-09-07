import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';
import { charactersModule } from 'src/module-storage';
import { AvailableRacesKey } from 'alcarin/game/characters/plugins/races/index';

import { logger } from '../../helpers/logger';

interface CreateNewCharacterReq {
  body: {
    name: string;
    race: AvailableRacesKey;
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
  const accountId = req.accountId;

  try {
    const id = await charactersModule.createCharacter(accountId, name, race);
    logger.info(`Character "${name} with race ${race}" created`);

    return res.status(status.CREATED).send(id);
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};

export const findCharactersForUsers: AppRequestHandler = async (req, res) => {
  const accountId = req.accountId;

  try {
    const characters = await charactersModule.getCharactersForOwner(accountId);
    return res.status(status.OK).send(characters);
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};
