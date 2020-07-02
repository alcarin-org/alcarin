import { Character } from './character.aggregate';

export interface CharacterRepository {
  save(user: Character): Promise<void>;
  getById(id: string): Promise<Character>;
}
