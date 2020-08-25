import { AccountModuleApi } from '@/alcarin/account';
import { DomainError } from '@/alcarin/shared/domain/domain-error';

import { Accounts } from '../domain/accounts.module';
import { Account } from '../domain/account.vo';

export function adjustAccountModule(accountModule: AccountModuleApi): Accounts {
  async function getByEmail(email: string): Promise<Account> {
    const account = await accountModule.queryAccountByEmail(email);
    if (account === null) {
      throw new DomainError('Account not found');
    }
    return new Account(
      account.id,
      account.email,
      account.passwordHash,
      account.isAdmin
    );
  }

  async function getAccountById(accountId: string): Promise<Account> {
    const account = await accountModule.queryAccountById(accountId);
    if (account === null) {
      throw new DomainError('Account not found');
    }
    return new Account(
      account.id,
      account.email,
      account.passwordHash,
      account.isAdmin
    );
  }
  return {
    getByEmail,
    getAccountById,
  };
}
