import { CharactersRepo } from '../../db';
import { User, Character } from '../../db/entities';
import { DomainError } from '../../shared/DomainError';

import { RaceErrors } from './races';
import { createRaceFromKey, RaceType } from './races';

export type CharacterModel = Pick<Character, 'id' | 'name'> & {
  race: RaceType;
};

function createCharacterModel(character: Character): CharacterModel {
  return {
    id: character.id,
    name: character.name,
    race: createRaceFromKey(character.race),
  };
}

export class CharacterNotFound extends DomainError {
  constructor(characterId: string) {
    super(`There is no character with id ${characterId}`);
  }
}

export type CharacterErrors = CharacterNotFound | RaceErrors;

export async function createCharacter(
  owner: User,
  name: string,
  raceKey: string
) {
  const race = createRaceFromKey(raceKey);
  const character = await CharactersRepo.born(owner, name, race.key);
  return createCharacterModel(character);
}

export async function findCharacter(characterId: string) {
  const character = await CharactersRepo.findOne({ id: characterId });
  if (undefined === character) {
    throw new CharacterNotFound(characterId);
  }
  return createCharacterModel(character);
}

export async function findCharacters(owner: User) {
  const characters = await CharactersRepo.find({ owner: owner });
  return characters.map(createCharacterModel);
}

