import { Character } from './character';

export type CreationCharacterPayload<TRaceKey> = {
  name: string;
  age: number;
  race: TRaceKey;
};

export type CharacterRepository<TRaceKey> = {
  create: (
    payload: CreationCharacterPayload<TRaceKey>
  ) => Promise<Character<TRaceKey>>;
  save: (character: Character<TRaceKey>) => Promise<Character<TRaceKey>>;
  createAndSave: (
    payload: CreationCharacterPayload<TRaceKey>
  ) => Promise<Character<TRaceKey>>;
  getById: (id: string) => Promise<Character<TRaceKey>>;
  getMultipleByIds: (characters: string[]) => Promise<Character<TRaceKey>[]>;
};
