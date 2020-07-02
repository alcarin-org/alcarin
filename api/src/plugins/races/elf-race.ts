import { RaceBehaviour } from '../../modules/characters/race/race.behaviour';

export class ElfBehaviour implements RaceBehaviour {
  public introduceYourself(): string {
    return `I'm proud elf!`;
  }

  public getNameOfRace(): string {
    return 'Elf';
  }
}
