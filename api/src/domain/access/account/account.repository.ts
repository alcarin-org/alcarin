import { Account } from './account'

export type AccountRepository = {
  getByEmail(email: string): Promise<Account>;
  create(email: string, passwordHash: string): Promise<Account>
  saveAccount(account: Account): Promise<void>;
  getById(id: string): Promise<Account>;
}