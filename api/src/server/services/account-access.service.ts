import {
  createCharacterForAccount,
  createCharacterForAccountDI,
} from 'src/domain/services/create-character-for-account.logic';
import {
  getAccountCharacters,
  getAccountCharactersDI,
} from 'src/domain/services/get-characters-for-account.logic';
import {
  loginWithPassword,
  loginWithPasswordDI,
} from 'src/domain/access/account/services/login-with-password.logic';
import {
  registerAccountWithPassword,
  registerAccountWithPasswordDI,
} from 'src/domain/access/services/register-account-with-password.logic';

import {
  bCryptEncrypter,
  jwtTokenizer,
  accountRepository,
  characterRepository,
  AvailableRace,
} from './di-ready-components';

const createCharacterDi: createCharacterForAccountDI<AvailableRace> = {
  accountRepository,
  characterRepository,
};
export async function createCharacter(
  accountId: string,
  name: string,
  raceKey: AvailableRace
) {
  return createCharacterForAccount<AvailableRace>(
    createCharacterDi,
    accountId,
    name,
    raceKey
  );
}

const getCharactersDi: getAccountCharactersDI<AvailableRace> = {
  accountRepository,
  characterRepository,
};
export async function getCharacters(accountId: string) {
  return getAccountCharacters<AvailableRace>(createCharacterDi, accountId);
}

const loginDi: loginWithPasswordDI = {
  tokenizer: jwtTokenizer,
  encryptor: bCryptEncrypter,
  accountRepository,
};
export async function login(email: string, password: string) {
  return loginWithPassword(loginDi, email, password);
}

const registerDi: registerAccountWithPasswordDI = {
  encryptor: bCryptEncrypter,
  accountRepository,
};
export async function register(email: string, password: string) {
  return registerAccountWithPassword(registerDi, email, password);
}
