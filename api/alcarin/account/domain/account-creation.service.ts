import { DomainError } from '../../shared/domain/domain-error';

import { Accounts } from './accounts.repository';

export async function createAccountWithPassword(
  accounts: Accounts,
  email: string,
  hashPassword: string
) {
  await checkUniqueEmail(accounts, email);
  return accounts.create(email, hashPassword);
}

async function checkUniqueEmail(accounts: Accounts, email: string) {
  const account = await accounts.findByEmail(email);
  if (account !== null) {
    throw new DomainError('We have account with that email');
  }
}
