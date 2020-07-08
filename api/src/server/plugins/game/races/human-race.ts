import {
  CharacterRaceBehaviour,
  CharacterRace,
} from 'src/domain/game/character/character-race';

export const humanBehaviour = <TRaceKey>(): CharacterRaceBehaviour<TRaceKey> => {
  const introduceYourself = (race: CharacterRace<TRaceKey>): string => {
    return `I'm proud ${raceName(race)}!`;
  };

  const raceName = (race: CharacterRace<TRaceKey>): string => {
    return `Human`;
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
