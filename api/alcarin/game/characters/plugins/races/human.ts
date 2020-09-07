import { RacePlugin } from '../../domain/race-plugin';
import { Character } from '../../domain/character';
import { Race, RaceBehaviour, RaceModel } from '../../domain/race';

export const HUMAN_RACE_KEY = 'human';
export type HUMAN_RACE_KEY_TYPE = 'human';

function humanRaceModel(): RaceModel {
  return {
    startingAge: 20,
    raceKey: HUMAN_RACE_KEY,
  };
}

const humanRaceBehaviour: RaceBehaviour = {
  introduceYourself,
};

function introduceYourself(character: Character) {
  return `Hello my name is ${character.name} and I'm brave human`;
}

export const HumanPlugin: RacePlugin = {
  is(raceKey: string): boolean {
    return raceKey === HUMAN_RACE_KEY;
  },
  properties(): Race {
    return {
      model: humanRaceModel(),
      behaviour: humanRaceBehaviour,
    };
  },
};
