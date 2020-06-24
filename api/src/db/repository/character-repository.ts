import { EntityRepository, Repository } from 'typeorm';

import { Character } from '../entities/character';

@EntityRepository(Character)
export class CharacterRepository extends Repository<Character> {
  async born(name: string, race: string) {
    const character = this.manager.create(Character, {
      name,
      race,
    });

    return this.manager.insert(Character, character);
  }
}
