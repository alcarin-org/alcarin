import { RaceBehaviour, RaceModel } from './race';

export interface Character {
  id: string;
  name: string;
  owner: Owner;
  bornAt: number;
  raceBehaviour: RaceBehaviour;
  raceModel: RaceModel;
}

export interface CharacterCandidate {
  name: string;
  owner: Owner;
  bornAt: number;
}
