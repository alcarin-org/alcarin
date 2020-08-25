import { Race } from '../../shared/domain/race.vo';

import { Character } from './character.vo';

export interface Characters {
  createNormalCharacter(name: string, race: Race): Promise<Character>;
  createGodCharacter(name: string, race: Race): Promise<Character>;
}
