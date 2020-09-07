import { HumanPlugin, HUMAN_RACE_KEY, HUMAN_RACE_KEY_TYPE } from './human';

export const availableRacePlugins = [
  { key: HUMAN_RACE_KEY, plugin: HumanPlugin },
];

export type AvailableRacesKey = HUMAN_RACE_KEY_TYPE;
