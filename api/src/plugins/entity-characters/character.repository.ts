import { getRepository } from 'typeorm';

import {
  CharactersPersonalInformation,
  CharactersRace,
  CharactersCharacter,
} from '../../db/entities';
import { CharacterRepository } from '../../modules/characters/character.repository';
import { Character } from '../../modules/characters/character.aggregate';
import { Race } from '../../modules/characters/race/race.model';
import { PersonalInformation } from '../../modules/characters/personal-information/personal-information';
import { RaceProvider } from '../../modules/characters/race/race-provider';

const charRepository = getRepository(CharactersCharacter);

export class EntityCharacterRepository implements CharacterRepository {
  private _raceProvider: RaceProvider;
  constructor(raceProvider: RaceProvider) {
    this._raceProvider = raceProvider;
  }
  async getById(id: string): Promise<Character> {
    const relations = ['race', 'personalInfo'];
    const character = await charRepository.findOne({ id }, { relations });
    if (!character) {
      throw 'character not found';
    }
    return this.mapCharacterToModel(character);
  }

  async save(character: Character): Promise<void> {
    const characterEntity = new CharactersCharacter();
    characterEntity.id = character.id;

    characterEntity.race = new CharactersRace();
    characterEntity.race.raceKey = character.race.key;

    characterEntity.personalInfo = new CharactersPersonalInformation();
    characterEntity.personalInfo.name = character.personalInformation.name;
    characterEntity.personalInfo.age = character.personalInformation.age;

    await charRepository.save(characterEntity);
  }

  private mapCharacterToModel(character: CharactersCharacter): Character {
    const race = this.mapRaceToModel(character.race);
    const personalInformation = this.mapPersonalInfoToModel(
      character.personalInfo
    );

    return {
      id: character.id,
      race,
      personalInformation,
    };
  }

  private mapRaceToModel(race: CharactersRace): Race {
    return {
      key: race.raceKey,
      behaviour: this._raceProvider.provideRaceBehaviour(race.raceKey),
    };
  }

  private mapPersonalInfoToModel(
    info: CharactersPersonalInformation
  ): PersonalInformation {
    return {
      name: info.name,
      age: info.age,
    };
  }
}
