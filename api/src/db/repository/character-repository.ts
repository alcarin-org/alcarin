import { EntityRepository, Repository } from 'typeorm';

import { Character } from '../entities/character';
import { User } from '../entities';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async register(owner: User, name: string, race: string) {
    const plain = {
      name,
      race,
      owner,
    };
    const character = this.manager.create(Character, plain);
    return this.manager.insert(Character, character);
  }
}
