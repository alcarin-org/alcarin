import { AppRequestHandler } from 'express';
import boom from '@hapi/boom';
import status from 'http-status-codes';
import { logger } from '@/server/core/helpers/logger';
import {
  createCharacter,
  getCharacters,
} from '@/application/account-access.service';
import { Character } from '@/domain/game/character/character';
import { AvailableRace } from '@/domain/game/character/race';

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
  const accountId = req.accountId;

  try {
    const character = await createCharacter(accountId, name, race);
    logger.info(`Character "${name} with race ${race}" created`);

    return res.status(status.CREATED).send(mapCharacterToResponse(character));
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};

export const findCharactersForUsers: AppRequestHandler = async (req, res) => {
  const accountId = req.accountId;

  try {
    const characters = await getCharacters(accountId);

    return res.status(status.OK).send(characters.map(mapCharacterToResponse));
  } catch (err) {
    throw boom.badRequest(err.message);
  }
};

function mapCharacterToResponse(character: Character) {
  return {
    name: character.name,
    id: character.id,
    race: character.raceKey,
  };
}
