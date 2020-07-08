import { CharacterRaceBehaviour } from 'src/domain/game/character/character-race';

export type RaceKeyProvider<TRaceKey> = (raceKey: string) => TRaceKey;

export type CharacterRaceBehaviourProvider<TRaceKey> = (
  raceKey: TRaceKey
) => CharacterRaceBehaviour<TRaceKey>;
