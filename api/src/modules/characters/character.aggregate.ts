import {
  Race,
  RaceBehaviour,
  AvailableRaceKey,
  create as createRace,
  introduce as introduceRace,
} from './race/race.model';
import {
  PersonalInformation,
  create as createPersonalInformation,
  introduceYourself as introducePersonalInfo,
} from './personal-information/personal-information';

export type Character = {
  id: string;
  personalInformation: PersonalInformation;
  race: Race;
};

export function create(
  id: string,
  name: string,
  age: number,
  raceKey: AvailableRaceKey,
  raceBehaviour: RaceBehaviour
): Character {
  const personalInformation = createPersonalInformation(name, age);
  const race = createRace(raceKey, raceBehaviour);
  return {
    id,
    personalInformation,
    race,
  };
}

export function introduceYourself(character: Character) {
  const personal = introducePersonalInfo(character.personalInformation);
  const race = introduceRace(character.race);
  return `${personal} ${race}`;
}
