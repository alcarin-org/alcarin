import { CharacterRaceBehaviour } from '../race';

export const RaceKey = 'human' as const;

type RaceKeyType = typeof RaceKey;

export const humanBehaviour = (): CharacterRaceBehaviour<RaceKeyType> => ({
  raceName() {
    return `Human`;
  },

  introduceYourself() {
    return `I'm proud ${RaceKey}!`;
  },
});
