import { Chronos } from '../../domain/chronos';

// #TODO reimplement naive implementation
export class ChronosImp implements Chronos {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  howOldAmI(startingAge: number, bornDate: number): Promise<number> {
    return Promise.resolve(startingAge);
  }

  whatIsCurrentGameTime(): Promise<number> {
    return Promise.resolve(0);
  }
}
