import { RacePluginRegistry } from '../domain/race-plugin-registry';
import { Characters } from '../domain/characters';
import { CharacterCandidate } from '../domain/character';
import { Chronos } from '../domain/chronos';

import { CharactersQuery } from './characters-query';

export function CharactersService(
  racePluginRegistry: RacePluginRegistry,
  query: CharactersQuery,
  characters: Characters,
  chronos: Chronos
) {
  async function createCharacter(
    ownerId: string,
    name: string,
    raceKey: string
  ) {
    const owner: Owner = { id: ownerId };
    const characterCandidate: CharacterCandidate = {
      name,
      owner,
      bornAt: await chronos.whatIsCurrentGameTime(),
    };

    const race = racePluginRegistry.getRaceForKey(raceKey);
    const character = await characters.Born(characterCandidate, race.model);
    return character.id;
  }

  async function getCharactersForOwner(ownerId: string) {
    return query.getCharacterListForOwner(ownerId);
  }

  return { createCharacter, getCharactersForOwner };
}
