import { Character } from './model/character';

export interface CharactersQuery {
  getCharacterListForOwner(ownerId: string): Promise<Character[]>;
}
