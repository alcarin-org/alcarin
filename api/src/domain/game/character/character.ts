import { CharacterRaceBehaviour, AvailableRace } from './race';

export const StartingAge = 20;

export interface Character {
  id: string;
  name: string;
  age: number;
  raceKey: AvailableRace;
}

export type CharacterBehaviour<TRaceKey> = CharacterRaceBehaviour<TRaceKey>;
