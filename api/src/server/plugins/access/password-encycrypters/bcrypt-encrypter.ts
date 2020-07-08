import bcrypt from 'bcrypt';
import { PasswordEncryptor } from 'src/domain/access/tools/password-encryptor.tool';
import { envVars } from 'src/server/core/env-vars';

const hashCost: number = envVars.BCRYPT_ROUNDS;

export const bCryptEncrypter: PasswordEncryptor = {
  hashPassword(passwordProvided: string): Promise<string> {
    return bcrypt.hash(passwordProvided, hashCost);
  },

  isPasswordMatch(
    currentHashedPassword: string,
    passwordProvided: string
  ): Promise<boolean> {
    return bcrypt.compare(passwordProvided, currentHashedPassword);
  },
};
