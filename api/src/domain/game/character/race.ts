import { elfBehaviour, RaceKey as ElfRaceKey } from './race/elf-race';
import { humanBehaviour, RaceKey as HumanRaceKey } from './race/human-race';
import { Character } from './character';

export function getAvailableRaces() {
  return [HumanRaceKey, ElfRaceKey];
}

export type AvailableRace = ReturnType<typeof getAvailableRaces>[0];

export type CharacterRaceBehaviour<AvailableRace> = {
  introduceYourself: (character: Character) => string;

  raceName(): string;
};

export function characterRaceBehaviourProvider(
  raceKey: AvailableRace
): CharacterRaceBehaviour<AvailableRace> {
  switch (raceKey) {
    case 'elf':
      return elfBehaviour();
    case 'human':
      return humanBehaviour();
    default:
      throw new Error(`There is no behaviour defined for race "${raceKey}"`);
  }
}
