import { CharacterRaceBehaviour } from './character-race';

export const StartingAge = 20;

export type CharacterRace<TRaceKey> = {
  raceKey: TRaceKey;
};

export type Character<TRaceKey> = {
  id: string;
  name: string;
  age: number;
} & CharacterRace<TRaceKey>;

export type CharacterBehaviour<TRaceKey> = {} & CharacterRaceBehaviour<
  TRaceKey
>;
