import { In } from 'typeorm';
import { Character } from '@/domain/game/character/character';
import {
  CharacterRepository,
  CreationCharacterPayload,
} from '@/domain/game/character/character.repository';
import { RaceKeyProvider } from '@/domain/game/tools/character-race-provider.tool';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';

import { connection } from '../..';
import { Character as CharacterEntity } from '../../entities/game/character';

export const createEntityCharacterRepository = <TRaceKey extends string>(
  raceKeyProvider: RaceKeyProvider<TRaceKey>,
  identifierProviderService: IdentifierProviderService
): CharacterRepository<TRaceKey> => {
  const charRepository = connection.getRepository(CharacterEntity);
  const createCharacter = createNewCharacter<TRaceKey>(
    identifierProviderService
  );
  const entityToModel = getEntityToModelMapper<TRaceKey>(raceKeyProvider);

  async function create(payload: CreationCharacterPayload<TRaceKey>) {
    return createCharacter(payload);
  }

  async function save(character: Character<TRaceKey>) {
    const entityCharacter = await charRepository.save(
      mapModelToEntity(character)
    );
    return entityToModel(entityCharacter);
  }

  async function createAndSave(payload: CreationCharacterPayload<TRaceKey>) {
    const character = createCharacter(payload);
    await save(character);
    return character;
  }

  async function getById(id: string): Promise<Character<TRaceKey>> {
    const characterEntity = await charRepository.findOneOrFail(id);
    return entityToModel(characterEntity);
  }
  async function getMultipleByIds(characters: string[]) {
    const entities = await charRepository.find({
      where: { id: In(characters) },
    });
    return entities.map(entityToModel);
  }

  return {
    createAndSave,
    create,
    getById,
    getMultipleByIds,
    save,
  };
};

function createNewCharacter<TRaceKey>(
  IdentifierProviderService: IdentifierProviderService
) {
  return (payload: CreationCharacterPayload<TRaceKey>) => {
    return {
      id: IdentifierProviderService.genIdentifier(),
      name: payload.name,
      age: payload.age,
      raceKey: payload.race,
    };
  };
}

function getEntityToModelMapper<TRaceKey>(
  raceKeyProvider: RaceKeyProvider<TRaceKey>
) {
  return (characterEntity: CharacterEntity) => {
    return {
      id: characterEntity.id,
      raceKey: raceKeyProvider(characterEntity.raceKey),
      name: characterEntity.name,
      age: characterEntity.age,
    };
  };
}

function mapModelToEntity<TRaceKey extends string>(
  character: Character<TRaceKey>
) {
  const entity = new CharacterEntity();
  entity.id = character.id;
  entity.name = character.name;
  entity.age = character.age;
  entity.raceKey = character.raceKey;

  return entity;
}
