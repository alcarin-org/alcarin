import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';

import { logger } from '../../../shared/logger';
import { isDomainError } from '../../../shared/error-handling-helper';
import {
  createCharacter,
  findCharacter,
  findCharacters,
  CharacterErrors,
} from '../characters.context';

interface CreateNewCharacterReq {
  body: {
    name: string;
    race: string;
  };
}

interface OneCharacterPayload {
  params: {
    characterId: string;
  };
}

const isCharacterError = isDomainError<CharacterErrors>();

export const createNewCharacter: AppRequestHandler<CreateNewCharacterReq> = async (
  req,
  res
) => {
  const { name, race } = req.body;
  const user = req.user;

  try {
    const character = await createCharacter(user, name, race);
    logger.info(`Character "${name} with race ${character.race.name}" created`);

    return res.status(status.CREATED).send(character);
  } catch (err) {
    if (isCharacterError(err)) {
      throw boom.badRequest(err.message);
    }

    throw boom.internal(err.message);
  }
};

export const findCharactersForUsers: AppRequestHandler = async (req, res) => {
  const user = req.user;

  try {
    const characters = await findCharacters(user);

    return res.status(status.OK).send(characters);
  } catch (err) {
    if (isCharacterError(err)) {
      throw boom.badRequest(err.message);
    }

    throw boom.internal(err.message);
  }
};

export const findOneCharacter: AppRequestHandler<OneCharacterPayload> = async (
  req,
  res
) => {
  const characterId = req.params.characterId;

  try {
    const character = await findCharacter(characterId);

    return res.status(status.OK).send(character);
  } catch (err) {
    if (isCharacterError(err)) {
      throw boom.badRequest(err.message);
    }

    throw boom.internal(err.message);
  }
};
