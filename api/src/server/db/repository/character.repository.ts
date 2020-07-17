import { Connection, EntityManager, Repository, In } from 'typeorm';
import { Character } from '@/domain/game/character/character';
import {
  CharacterRepository as CharacterRepositoryInterface,
  CreationCharacterPayload,
} from '@/domain/game/character/character.repository';
import { RaceKeyProvider } from '@/domain/game/tools/character-race-provider.tool';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';

import { getDefaultConnection } from '..';
import { Character as CharacterEntity } from '../entities/character';

export class CharacterRepository<TRaceKey extends string>
  implements CharacterRepositoryInterface<TRaceKey> {
  charRepository: Repository<CharacterEntity>;

  constructor(
    private identifierProviderService: IdentifierProviderService,
    private raceKeyProvider: RaceKeyProvider<TRaceKey>,
    dbConnection: Connection | EntityManager | null = getDefaultConnection()
  ) {
    if (!dbConnection) {
      throw new Error('Database not ready yet');
    }

    this.charRepository = dbConnection.getRepository(CharacterEntity);
  }

  async createAndSave(payload: CreationCharacterPayload<TRaceKey>) {
    const character = await this.create(payload);
    await this.save(character);
    return character;
  }

  async create(payload: CreationCharacterPayload<TRaceKey>) {
    return {
      id: this.identifierProviderService.genIdentifier(),
      name: payload.name,
      age: payload.age,
      raceKey: payload.race,
    };
  }

  async save(character: Character<TRaceKey>) {
    const entityCharacter = await this.charRepository.save(
      this.mapModelToEntity(character)
    );
    return this.mapEntityToModel(entityCharacter);
  }

  async getById(id: string) {
    const characterEntity = await this.charRepository.findOneOrFail(id);
    return this.mapEntityToModel(characterEntity);
  }

  async getMultipleByIds(characterIds: string[]) {
    const entities = await this.charRepository.find({
      where: { id: In(characterIds) },
    });
    return entities.map(entity => this.mapEntityToModel(entity));
  }

  private mapEntityToModel(
    characterEntity: CharacterEntity
  ): Character<TRaceKey> {
    return {
      id: characterEntity.id,
      raceKey: this.raceKeyProvider(characterEntity.raceKey),
      name: characterEntity.name,
      age: characterEntity.age,
    };
  }

  private mapModelToEntity(character: Character<TRaceKey>) {
    const entity = new CharacterEntity();
    entity.id = character.id;
    entity.name = character.name;
    entity.age = character.age;
    entity.raceKey = character.raceKey;

    return entity;
  }
}
