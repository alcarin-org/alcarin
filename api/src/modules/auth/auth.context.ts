import bcrypt from 'bcrypt';

import { envVars } from '../../shared/envVars';
import { UserRepo } from '../../db';

export async function registerUser(email: string, password: string) {
  const hashCost: number = envVars.BCRYPT_ROUNDS;

  const passwordHash = await bcrypt.hash(password, hashCost);
  return UserRepo.register(email, passwordHash);
}
