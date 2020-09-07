import { Race } from './race';

export interface RacePlugin {
  is(raceKey: string): boolean;
  properties(): Race;
}
