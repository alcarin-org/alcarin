import { Account } from './account.aggregate';

export interface Accounts {
  create(email: string, passwordHash: string): Promise<Account>;

  save(account: Account): Promise<Account>;

  getById(id: string): Promise<Account>;

}
