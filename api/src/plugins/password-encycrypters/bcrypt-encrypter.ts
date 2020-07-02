import bcrypt from 'bcrypt';

import { PasswordEncryptionService } from '../../modules/users/authorization/password-encryption.service';
import { envVars } from '../../shared/env-vars';

export class BCryptEncrypter implements PasswordEncryptionService {
  hashCost: number = envVars.BCRYPT_ROUNDS;

  hashPassword(passwordProvided: string): Promise<string> {
    return bcrypt.hash(passwordProvided, this.hashCost);
  }

  isPasswordMatch(
    currentHashedPassword: string,
    passwordProvided: string
  ): Promise<boolean> {
    return bcrypt.compare(passwordProvided, currentHashedPassword);
  }
}
