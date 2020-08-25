import * as bcrypt from 'bcrypt';

import { PasswordEncryptor } from '../../domain/password-encrypter.module';

export function bCryptEncrypterFactory(hashCost: number): PasswordEncryptor {
  async function hashPassword(passwordProvided: string): Promise<string> {
    return bcrypt.hash(passwordProvided, hashCost);
  }

  async function isPasswordMatch(
    currentHashedPassword: string,
    passwordProvided: string
  ): Promise<boolean> {
    return bcrypt.compare(passwordProvided, currentHashedPassword);
  }

  return {
    hashPassword,
    isPasswordMatch,
  };
}
