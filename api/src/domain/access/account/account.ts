import { PasswordEncryptor } from '../tools/password-encryptor.tool';

export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  characters: {
    id: string;
  }[];
}

export function canLogin(
  account: Account,
  passwordCandidate: string,
  encryptor: PasswordEncryptor
): Promise<boolean> {
  return encryptor.isPasswordMatch(account.passwordHash, passwordCandidate);
}