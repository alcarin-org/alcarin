import { Character } from './character';

export interface CreationCharacterPayload {
  name: string;
  age: number;
}

export interface CharacterRepository {
  createElf: (name: string, age: number) => Promise<Character>;
  createHuman: (name: string, age: number) => Promise<Character>;

  save: (character: Character) => Promise<Character>;

  createAndSave: (payload: CreationCharacterPayload) => Promise<Character>;

  getById: (id: string) => Promise<Character>;

  getMultipleByIds: (characters: string[]) => Promise<Character[]>;
}
