import { Characters } from '../domain/characters.module';
import { Race } from '../../shared/domain/race.vo';
import { Character } from '../domain/character.vo';

function createNormalCharacter(name: string, race: Race): Promise<Character> {
  return null;
}
function createGodCharacter(name: string, race: Race): Promise<Character> {
  return null;
}

export const charactersModule: Characters = {
  createNormalCharacter,
  createGodCharacter,
};
