import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { envVars } from '../../shared/env-vars';
import { UserRepo } from '../../db';

const InvalidAuthMessage = 'Invalid email or password';

export async function registerUser(email: string, password: string) {
  const hashCost: number = envVars.BCRYPT_ROUNDS;

  const passwordHash = await bcrypt.hash(password, hashCost);
  return UserRepo.register(email, passwordHash);
}

export async function logInUser(email: string, password: string) {
  const user = await UserRepo.findOne(email);
  if (!user) {
    throw new Error(InvalidAuthMessage);
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordsMatch) {
    throw new Error(InvalidAuthMessage);
  }

  return createAuthToken(email);
}

function createAuthToken(email: string) {
  const payload = {
    ['client_id']: email,
  };

  return jsonwebtoken.sign(payload, envVars.AUTH_KEY, {
    issuer: envVars.URL_BASE,
    audience: envVars.URL_BASE,
    expiresIn: envVars.AUTH_EXPIRATION_SEC,
  });
}
