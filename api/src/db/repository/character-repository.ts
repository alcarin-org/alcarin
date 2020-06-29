import { EntityRepository, Repository } from 'typeorm';

import { User, Character } from '../entities';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async born(owner: User, name: string, race: string) {
    const plain = {
      name,
      race,
      owner,
    };
    const character = this.manager.create(Character, plain);
    return this.manager.save(Character, character);
  }
}
