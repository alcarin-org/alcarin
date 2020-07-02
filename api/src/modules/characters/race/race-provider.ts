import { AvailableRaceKey, RaceBehaviour } from './race.model';

export interface RaceProvider {
  provideRaceBehaviour(key: AvailableRaceKey): RaceBehaviour;
}
