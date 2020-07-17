import { Connection, EntityManager, Repository, In } from 'typeorm';
import { Character } from '@/domain/game/character/character';
import {
  CharacterRepository as CharacterRepositoryInterface,
  CreationCharacterPayload,
} from '@/domain/game/character/character.repository';
import { AvailableRace } from '@/domain/game/character/race';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';

import { getDefaultConnection } from '..';
import { Character as CharacterEntity } from '../entities/character';

export class CharacterRepository implements CharacterRepositoryInterface {
  charRepository: Repository<CharacterEntity>;

  constructor(
    private identifierProviderService: IdentifierProviderService,
    dbConnection: Connection | EntityManager | null = getDefaultConnection()
  ) {
    if (!dbConnection) {
      throw new Error('Database not ready yet');
    }

    this.charRepository = dbConnection.getRepository(CharacterEntity);
  }

  async createAndSave(payload: CreationCharacterPayload) {
    const character = await this.create(payload);
    await this.save(character);
    return character;
  }

  async create(payload: CreationCharacterPayload) {
    return {
      id: this.identifierProviderService.genIdentifier(),
      name: payload.name,
      age: payload.age,
      raceKey: payload.race,
    };
  }

  async save(character: Character) {
    const entityCharacter = await this.charRepository.save(
      mapModelToEntity(character)
    );
    return mapEntityToModel(entityCharacter);
  }

  async getById(id: string) {
    const characterEntity = await this.charRepository.findOneOrFail(id);
    return mapEntityToModel(characterEntity);
  }

  async getMultipleByIds(characterIds: string[]) {
    const entities = await this.charRepository.find({
      where: { id: In(characterIds) },
    });
    return entities.map(entity => mapEntityToModel(entity));
  }
}

export function mapEntityToModel(characterEntity: CharacterEntity): Character {
  return {
    id: characterEntity.id,
    raceKey: parseRaceKey(characterEntity.raceKey),
    name: characterEntity.name,
    age: characterEntity.age,
  };
}

export function mapModelToEntity(character: Character) {
  const entity = new CharacterEntity();
  entity.id = character.id;
  entity.name = character.name;
  entity.age = character.age;
  entity.raceKey = character.raceKey.toString();

  return entity;
}

function parseRaceKey(raceKey: string): AvailableRace {
  const parsedRace = Object.entries(AvailableRace).find(
    ([_key, value]) => value == raceKey
  );
  if (parsedRace === undefined) {
    throw new Error(`Invalid race "${raceKey}"`);
  }

  return parsedRace[1];
}
