import { RaceBehaviour } from './race.behaviour';

export type AvailableRaceKey = string;

export { RaceBehaviour };
export type Race = {
  behaviour: RaceBehaviour;
  key: AvailableRaceKey;
};

export function create(key: AvailableRaceKey, behaviour: RaceBehaviour): Race {
  return {
    key,
    behaviour: behaviour,
  };
}

export function introduce(race: Race) {
  return race.behaviour.introduceYourself();
}
