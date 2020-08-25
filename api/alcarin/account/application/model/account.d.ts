import { Character } from './character';

export interface Account {
  id: string;
  characters: Array<Character>;
}
