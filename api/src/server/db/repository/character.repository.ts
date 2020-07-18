import { Connection, EntityManager, Repository, In } from 'typeorm';
import { Character } from '@/domain/game/character/character';
import {
  CharacterRepository as CharacterRepositoryInterface,
  CreationCharacterPayload,
} from '@/domain/game/character/character.repository';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';
import { AvailableRace } from '@/domain/game/character/race';

import { getDefaultConnection } from '..';
import { Character as CharacterEntity } from '../entities/character';

export class CharacterRepository<TRaceType>
  implements CharacterRepositoryInterface {
  charRepository: Repository<CharacterEntity>;

  constructor(
    private identifierProviderService: IdentifierProviderService,
    private raceParser: RaceParser,
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
    return mapEntityToModel(entityCharacter, this.raceParser);
  }

  async getById(id: string) {
    const characterEntity = await this.charRepository.findOneOrFail(id);
    return mapEntityToModel(characterEntity, this.raceParser);
  }

  async getMultipleByIds(characterIds: string[]) {
    const entities = await this.charRepository.find({
      where: { id: In(characterIds) },
    });
    return entities.map(entity => mapEntityToModel(entity, this.raceParser));
  }
}

export interface RaceParser {
  parse(raceKey: string): AvailableRace;
  stringify(race: AvailableRace): string;
}

export function mapEntityToModel(
  characterEntity: CharacterEntity,
  raceParser: RaceParser
): Character {
  return {
    id: characterEntity.id,
    raceKey: raceParser.parse(characterEntity.raceKey),
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
