import { AvailableRace } from './race';

import { Character } from '.';

export interface CreationCharacterPayload {
  name: string;
  age: number;
  race: AvailableRace;
}

export interface CharacterRepository {
  create: (payload: CreationCharacterPayload) => Promise<Character>;

  save: (character: Character) => Promise<Character>;

  createAndSave: (payload: CreationCharacterPayload) => Promise<Character>;

  getById: (id: string) => Promise<Character>;

  getMultipleByIds: (characters: string[]) => Promise<Character[]>;
}
