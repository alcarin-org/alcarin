import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Accounts } from '../../domain/accounts';

import { Account } from './entities/account';

export const accountRepository: Accounts = {
  create(email: string, passwordHash: string): Account {
    return {
      id: uuid(),
      email: email,
      passwordHash: passwordHash,
      isAdmin: false,
    };
  },
  async getByEmail(email: string) {
    const repository = getRepository(Account);
    const accounts = await repository.find({});
    return repository.findOne({ email });
  },
  async getById(id: string) {
    const repository = getRepository(Account);
    return repository.findOne({ id });
  },
  async save(account: Account): Promise<Account> {
    const repository = getRepository(Account);
    return repository.save(account);
  },
};
