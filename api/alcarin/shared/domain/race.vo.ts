export enum AvailableRaceKey {
  HUMAN = 'HUMAN',
  ELF = 'ELF',
  DWARF = 'DWARF',
}

type AvailableRaceKeyStrings = keyof typeof AvailableRaceKey;

export class Race {
  private race: AvailableRaceKey;
  private constructor(race: AvailableRaceKey) {
    this.race = race;
  }

  public key(): string {
    return this.race;
  }
  public static fromString(race: AvailableRaceKeyStrings) {
    return new Race(AvailableRaceKey[race]);
  }

  public static fromAvailableRace(race: AvailableRaceKey) {
    return new Race(race);
  }
}
