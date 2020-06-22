import { EntityManager, EntityRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { User } from '../entities/user';

@EntityRepository()
export class UserRepository {
  constructor(private manager: EntityManager) {}

  async get(email: string) {
    return this.manager.findOne(User, { email });
  }

  async getById(id: string) {
    return this.manager.findOne(User, { id });
  }

  async register(email: string, passwordHash: string) {
    const id = uuid();
    const user = this.manager.create(User, {
      id,
      email,
      passwordHash,
    });

    return this.manager.insert(User, user);
  }
}
