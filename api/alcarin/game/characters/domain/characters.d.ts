import { Character, CharacterCandidate } from './character';
import { RaceModel } from './race';

export interface Characters {
  Born(
    characterCandidate: CharacterCandidate,
    raceModel: RaceModel
  ): Promise<Character>;
}
