import { RaceProvider } from '../../modules/characters/race/race-provider';
import {
  AvailableRaceKey,
  RaceBehaviour,
} from '../../modules/characters/race/race.model';

import { ElfBehaviour } from './elf-race';
import { HumanBehaviour } from './human-race';

export type CurrentlyAvailableRaces = AvailableRaceKey & 'elf' & 'human';

export class AvailableRaceProvider implements RaceProvider {
  public provideRaceBehaviour(key: CurrentlyAvailableRaces): RaceBehaviour {
    switch (key) {
      case 'elf':
        return new ElfBehaviour();
      case 'human':
        return new HumanBehaviour();
    }

    throw 'undefined race';
  }
}
