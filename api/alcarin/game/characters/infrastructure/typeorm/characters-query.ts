import { getRepository } from 'typeorm';

import { RacePluginRegistry } from '../../domain/race-plugin-registry';
import { Character as ApplicationCharacter } from '../../application/model/character';
import { CharactersQuery } from '../../application/characters-query';
import { Chronos } from '../../domain/chronos';

import { Character as CharacterEntity } from './entities/character';

export function createQuery(
  racePluginRegistry: RacePluginRegistry,
  chronos: Chronos
): CharactersQuery {
  async function getCharacterListForOwner(
    ownerId: string
  ): Promise<ApplicationCharacter[]> {
    const repository = getRepository(CharacterEntity);
    const characters = await repository.find({ ownerId });
    return Promise.all(
      characters.map(characterEntity => {
        return mapEntityToApplication(
          characterEntity,
          chronos,
          racePluginRegistry
        );
      })
    );
  }
  return {
    getCharacterListForOwner,
  };
}

async function mapEntityToApplication(
  characterEntity: CharacterEntity,
  chronos: Chronos,
  racePluginRegistry: RacePluginRegistry
) {
  return {
    id: characterEntity.id,
    name: characterEntity.name,
    raceKey: characterEntity.raceKey,
    age: await getAgeForCharacter(characterEntity, chronos, racePluginRegistry),
  };
}

async function getAgeForCharacter(
  characterEntity: CharacterEntity,
  chronos: Chronos,
  racePluginRegistry: RacePluginRegistry
) {
  const race = racePluginRegistry.getRaceForKey(characterEntity.raceKey);
  return chronos.howOldAmI(race.model.startingAge, characterEntity.bornAt);
}
