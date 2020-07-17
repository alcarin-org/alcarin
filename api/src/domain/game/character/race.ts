import { elfBehaviour } from './race/elf-race';
import { humanBehaviour } from './race/human-race';

export type CharacterRace<TRaceKey> = {
  raceKey: TRaceKey;
};

export type CharacterRaceBehaviour<TRaceKey> = {
  isRace: <TRace extends CharacterRace<TRaceKey>>(
    race: TRace,
    raceCandidate: TRaceKey
  ) => boolean;
  introduceYourself: <TRace extends CharacterRace<TRaceKey>>(
    race: TRace
  ) => string;
  raceName: <TRace extends CharacterRace<TRaceKey>>(race: TRace) => string;
};

export enum AvailableRace {
  ELF = 'elf',
  HUMAN = 'human',
}

export function characterRaceBehaviourProvider(
  raceKey: AvailableRace
): CharacterRaceBehaviour<AvailableRace> {
  switch (raceKey) {
    case AvailableRace.ELF:
      return elfBehaviour<AvailableRace>();
    case AvailableRace.HUMAN:
      return humanBehaviour<AvailableRace>();
    default:
      throw new Error(`There is no behaviour defined for race "${raceKey}"`);
  }
}
