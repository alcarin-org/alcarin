import { CharactersRepo } from '../../db';
import { User, Character } from '../../db/entities';

import { createRaceFromKey, RaceType } from './races';

export type FullCharacter = Pick<Character, 'name' | 'owner' | 'id'> & {
  race: RaceType;
};

function decorateCharacterWithRace(character: Character) {
  const characterWithRace: FullCharacter = {
    ...character,
    race: createRaceFromKey(character.race),
  };
  return characterWithRace;
}

export async function createNewCharacterForUser(
  owner: User,
  name: string,
  raceKey: string
) {
  const race = createRaceFromKey(raceKey);
  const character = await CharactersRepo.born(owner, name, race.key);
  return decorateCharacterWithRace(character);
}
