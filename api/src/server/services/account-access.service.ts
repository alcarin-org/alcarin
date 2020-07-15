import {
  createCharacterForAccount,
  createCharacterForAccountDI,
} from '@/domain/services/create-character-for-account.logic';
import {
  getAccountCharacters,
  getAccountCharactersDI,
} from '@/domain/services/get-characters-for-account.logic';
import { loginWithPassword, loginWithPasswordDI } from '@/domain/access';
import {
  registerAccountWithPassword,
  registerAccountWithPasswordDI,
} from '@/domain/access';

import {
  bCryptEncrypter,
  jwtTokenizer,
  accountRepository,
  characterRepository,
  AvailableRace,
} from './di-ready-components';

export async function createCharacter(
  accountId: string,
  name: string,
  raceKey: AvailableRace
) {
  const createCharacterDi: createCharacterForAccountDI<AvailableRace> = {
    accountRepository,
    characterRepository,
  };
  return createCharacterForAccount<AvailableRace>(
    createCharacterDi,
    accountId,
    name,
    raceKey
  );
}

export async function getCharacters(accountId: string) {
  const getCharactersDi: getAccountCharactersDI<AvailableRace> = {
    accountRepository,
    characterRepository,
  };
  return getAccountCharacters<AvailableRace>(getCharactersDi, accountId);
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
  const registerDi: registerAccountWithPasswordDI = {
    encryptor: bCryptEncrypter,
    accountRepository,
  };
  return registerAccountWithPassword(registerDi, email, password);
}
