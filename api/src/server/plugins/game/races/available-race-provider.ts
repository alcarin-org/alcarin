import {
  CharacterRaceBehaviourProvider,
  RaceKeyProvider,
} from '@/domain/game/tools/character-race-provider.tool';

import { elfBehaviour } from './elf-race';
import { humanBehaviour } from './human-race';

export enum AvailableRace {
  ELF = 'elf',
  HUMAN = 'human',
}

export const raceKeyProvider: RaceKeyProvider<AvailableRace> = (
  raceKey: string
) => {
  switch (raceKey) {
    case 'elf':
      return AvailableRace.ELF;
    case 'human':
      return AvailableRace.HUMAN;
  }

  throw 'undefined race';
};

export const characterRaceBehaviourProvider: CharacterRaceBehaviourProvider<AvailableRace> = (
  raceKey: string
) => {
  switch (raceKey) {
    case 'elf':
      return elfBehaviour();
    case 'human':
      return humanBehaviour();
  }

  throw 'undefined race';
};
