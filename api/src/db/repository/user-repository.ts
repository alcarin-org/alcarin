import { EntityRepository, Repository } from 'typeorm';

import { User } from '../entities/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async register(email: string, passwordHash: string) {
    const user = this.manager.create(User, {
      email,
      passwordHash,
    });

    return this.manager.insert(User, user);
  }
}
