import { introduceYourself } from './character-behaviour';

export interface RaceModel {
  startingAge: number;
  raceKey: string;
}

export interface RaceBehaviour {
  introduceYourself: typeof introduceYourself | undefined;
}

export interface Race {
  model: RaceModel;
  behaviour: RaceBehaviour;
}
