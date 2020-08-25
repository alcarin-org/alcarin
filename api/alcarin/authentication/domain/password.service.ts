import { DomainError } from '../../shared/domain/domain-error';

import { Accounts } from './accounts.module';
import { PasswordEncryptor } from './password-encrypter.module';

async function login(
  accounts: Accounts,
  passwordEncryptor: PasswordEncryptor,
  email: string,
  password: string
) {
  const account = await accounts.findByEmail(email);

  if (account === null) {
    throw new DomainError('Invalid login data');
  }

  if (await passwordEncryptor.isPasswordMatch(account.passwordHash, password)) {
    return account.id;
  }
  throw new DomainError('Invalid login data');
}

async function changePassword(
  accounts: Accounts,
  passwordEncryptor: PasswordEncryptor,
  email: string,
  passwordCandidate: string
) {
  const passwordHash = await passwordEncryptor.hashPassword(passwordCandidate);
  await accounts.changePassword(email, passwordHash);
}

export const passwordService = {
  login,
  changePassword,
};
