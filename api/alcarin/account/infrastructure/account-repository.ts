import { Accounts } from '../domain/accounts.repository';
import { Account } from '../domain/account.aggregate';

function create(email: string, passwordHash: string): Promise<Account> {
  return null;
}

function save(account: Account): Promise<Account> {
  return null;
}

function getById(id: string): Promise<Account> {
  return null;
}

export const accountRepositoryModule: Accounts = {
  create,
  save,
  getById,
};
