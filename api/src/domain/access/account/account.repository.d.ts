import { Account } from './account';

export interface AccountRepository {
  getByEmail(email: string): Promise<Account>;

  create(email: string, passwordHash: string): Promise<Account>;

  saveAccount(account: Account): Promise<Account>;

  getById(id: string): Promise<Account>;
}
