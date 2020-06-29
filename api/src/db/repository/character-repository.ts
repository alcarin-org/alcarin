import { EntityRepository, Repository } from 'typeorm';

import { User, Character } from '../entities';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async born(owner: User, name: string, race: string) {
    const character = this.manager.create(Character, {
      name,
      race,
      owner,
    });
    return this.manager.save(Character, character);
  }
}
