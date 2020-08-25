import { Account } from './account.vo';

export interface Accounts {
  getByEmail(email: string): Promise<Account>;
  getAccountById(accountId: string): Promise<Account>;
}
