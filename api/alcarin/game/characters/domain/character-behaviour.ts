import { Chronos } from './chronos';
import { Character } from './character';

export function calculateCurrentAge(character: Character, chronos: Chronos) {
  return chronos.howOldAmI(character.raceModel.startingAge, character.bornAt);
}

export function introduceYourself(character: Character) {
  if (character.raceBehaviour.introduceYourself) {
    return character.raceBehaviour.introduceYourself;
  }
  return `hello by name is ${character.name}`;
}
