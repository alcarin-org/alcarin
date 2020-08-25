import { AccountModuleApi } from '@/alcarin/account';

import { Accounts } from '../domain/accounts.module';
import { Account } from '../domain/account.vo';

export function adjustAccountModule(accountModule: AccountModuleApi): Accounts {
  async function changePassword(
    email: string,
    passwordHash: string
  ): Promise<void> {
    return accountModule.changePassword(email, passwordHash);
  }
  async function findByEmail(email: string): Promise<Account | null> {
    const account = await accountModule.queryAccountByEmail(email);
    if (account === null) {
      return null;
    }
    return new Account(account.id, account.email, account.passwordHash);
  }
  return {
    changePassword,
    findByEmail,
  };
}
