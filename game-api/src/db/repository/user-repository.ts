import { EntityManager, EntityRepository } from 'typeorm';

import { User } from '../entities/user';

@EntityRepository()
export class UserRepository {
  constructor(private manager: EntityManager) {}

  async get(email: string) {
    return this.manager.findOne(User, { email });
  }
}
