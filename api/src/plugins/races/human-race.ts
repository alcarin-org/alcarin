import { RaceBehaviour } from '../../modules/characters/race/race.behaviour';

export class HumanBehaviour implements RaceBehaviour {
  introduceYourself(): string {
    return `I'm brave Human!`;
  }

  getNameOfRace(): string {
    return 'Human';
  }
}
