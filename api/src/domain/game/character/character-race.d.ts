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
