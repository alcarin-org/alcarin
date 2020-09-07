import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Characters } from '../../domain/characters';
import {
  Character as DomainCharacter,
  CharacterCandidate,
} from '../../domain/character';
import { RaceModel } from '../../domain/race';
import { RacePluginRegistry } from '../../domain/race-plugin-registry';

import { Character as CharacterEntity } from './entities/character';

export function createRepository(
  racePluginRegistry: RacePluginRegistry
): Characters {
  async function Born(
    characterCandidate: CharacterCandidate,
    raceModel: RaceModel
  ): Promise<DomainCharacter> {
    const character = {
      id: uuid(),
      name: characterCandidate.name,
      bornAt: characterCandidate.bornAt,
      raceKey: raceModel.raceKey,
      ownerId: characterCandidate.owner.id,
    };

    const repository = getRepository(CharacterEntity);
    await repository.save(character);

    const race = racePluginRegistry.getRaceForKey(character.raceKey);
    return {
      id: character.id,
      name: character.name,
      owner: characterCandidate.owner,
      bornAt: characterCandidate.bornAt,
      raceBehaviour: race.behaviour,
      raceModel: race.model,
    };
  }

  return {
    Born,
  };
}
