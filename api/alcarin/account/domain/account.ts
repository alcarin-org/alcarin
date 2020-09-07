import { PasswordEncryptor } from '@/alcarin/account/domain/password-encrypter';

export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

export async function changePasswordHash(
  account: Account,
  passwordEncrypter: PasswordEncryptor,
  passwordCandidate: string
): Promise<Account> {
  const passwordHash = await passwordEncrypter.hashPassword(passwordCandidate);
  return { ...account, passwordHash };
}

export function setPrivilegesToStandard(account: Account): Account {
  return { ...account, isAdmin: false };
}

export async function isPasswordMatch(
  account: Account,
  passwordEncrypter: PasswordEncryptor,
  passwordCandidate: string
): Promise<boolean> {
  return await passwordEncrypter.isPasswordMatch(
    account.passwordHash,
    passwordCandidate
  );
}
