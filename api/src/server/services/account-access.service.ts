import { createCharacterForAccount } from '@/domain/services/create-character-for-account.logic';
import { getAccountCharacters } from '@/domain/services/get-characters-for-account.logic';
import { loginWithPassword, loginWithPasswordDI } from '@/domain/access';
import {
  registerAccountWithPassword,
  verifyToken as verifyTokenService,
} from '@/domain/access';
import { bCryptEncrypter } from '@/server/plugins/access/password-encycrypters/bcrypt-encrypter';
import { jwtTokenizer } from '@/server/plugins/access/tokenizer/jwt-tokenizer-service';
import { AvailableRace } from '@/server/plugins/game/races/available-race-provider';

import { accountRepository, characterRepository } from './di-ready-components';

export async function createCharacter(
  accountId: string,
  name: string,
  raceKey: AvailableRace
) {
  return createCharacterForAccount(
    { accountRepository, characterRepository },
    accountId,
    name,
    raceKey
  );
}

export async function getCharacters(accountId: string) {
  return getAccountCharacters<AvailableRace>(
    { accountRepository, characterRepository },
    accountId
  );
}

export async function login(email: string, password: string) {
  const loginDi: loginWithPasswordDI = {
    tokenizer: jwtTokenizer,
    encryptor: bCryptEncrypter,
    accountRepository,
  };
  return loginWithPassword(loginDi, email, password);
}

export async function register(email: string, password: string) {
  return registerAccountWithPassword(
    { encryptor: bCryptEncrypter, accountRepository },
    email,
    password
  );
}

export async function verifyToken(token: string) {
  return verifyTokenService({ tokenizer: jwtTokenizer }, token);
}
