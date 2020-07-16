import { CharacterRaceBehaviour } from './character-race';

export const StartingAge = 20;

export interface CharacterRace<TRaceKey> {
  raceKey: TRaceKey;
}

export interface Character<TRaceKey> extends CharacterRace<TRaceKey> {
  id: string;
  name: string;
  age: number;
}

export type CharacterBehaviour<TRaceKey> = CharacterRaceBehaviour<TRaceKey>;
