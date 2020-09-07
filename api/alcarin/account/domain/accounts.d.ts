import { Account } from './account';

export interface Accounts {
  create(email: string, passwordHash: string): Account;
  save(account: Account): Promise<Account>;
  getById(id: string): Promise<Account | undefined>;
  getByEmail(email: string): Promise<Account | undefined>;
}
