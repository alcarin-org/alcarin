import { CharacterRaceBehaviour } from '../race';

export const RaceKey = 'elf' as const;
type RaceKeyType = typeof RaceKey;

export const elfBehaviour = (): CharacterRaceBehaviour<RaceKeyType> => ({
  raceName() {
    return `Elf`;
  },

  introduceYourself() {
    return `I'm proud ${RaceKey}`;
  },
});
