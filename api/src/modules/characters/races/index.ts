import { DomainError } from '../../../shared/domain-error';

import { Race } from './race';
import { elf as elfRace } from './elf';
import { human as HumanRace } from './human';

export type RaceType = Race;
export const elf = elfRace;
export const human = HumanRace;
export const all: Array<Race> = [elfRace, HumanRace];

export class CannotCreateRaceFromUnknownKey extends DomainError {
  constructor(key: string) {
    super(`Cannot create race from key ${key}`);
  }
}

export type RaceErrors = CannotCreateRaceFromUnknownKey;

export function createRaceFromKey(key: string) {
  const race = all.find(race => race.key === key);
  if (undefined === race) {
    throw new CannotCreateRaceFromUnknownKey(key);
  }
  return race;
}
