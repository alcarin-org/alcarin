export interface Chronos {
  howOldAmI(startingAge: number, bornDate: number): Promise<number>;
  whatIsCurrentGameTime(): Promise<number>;
}
