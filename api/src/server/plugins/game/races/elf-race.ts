import {
  CharacterRaceBehaviour,
  CharacterRace,
} from '@/domain/game/character/character-race';

export const elfBehaviour = <TRaceKey>(): CharacterRaceBehaviour<TRaceKey> => {
  const raceName = (_race: CharacterRace<TRaceKey>): string => {
    return `Elf`;
  };

  const introduceYourself = (race: CharacterRace<TRaceKey>): string => {
    return `I'm proud ${raceName(race)}!`;
  };

  const isRace = (race: CharacterRace<TRaceKey>, raceCandidate: TRaceKey) => {
    return race.raceKey === raceCandidate;
  };

  return {
    isRace,
    introduceYourself,
    raceName,
  };
};
