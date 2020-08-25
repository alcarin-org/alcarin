import { Account } from './account.vo';

export interface Accounts {
  findByEmail(email: string): Promise<Account | null>;
  changePassword(email: string, passwordHash: string): Promise<void>;
}
