import { loginWithPassword } from '@/domain/access';
import {
  registerAccountWithPassword,
  verifyToken as verifyTokenService,
} from '@/domain/access';

import * as game from '../domain/game';
import { Character } from '../domain/game/character/character';
import { AvailableRace } from '../domain/game/character/race';
import * as access from '../domain/access';

import { bCryptEncrypter } from './plugins/access/password-encycrypters/bcrypt-encrypter';
import { jwtTokenizer } from './plugins/access/tokenizer/jwt-tokenizer-service';
import { RepositoryFactory } from './repository-factory';

export async function createCharacter(
  accountId: string,
  name: string,
  raceKey: AvailableRace,
  repoFactory = RepositoryFactory.Default
) {
  const accountRepository = repoFactory.getAccountRepository();
  const characterRepository = repoFactory.getCharacterRepository();

  const character = await game.createCharacter(
    { characterRepository },
    name,
    raceKey
  );

  const account = await accountRepository.getById(accountId);

  await accountRepository.saveAccount(access.addCharacter(account, character));

  return character;
}

export async function getCharacters(
  accountId: string,
  repoFactory = RepositoryFactory.Default
): Promise<Character[]> {
  const accountRepository = repoFactory.getAccountRepository();

  const account = await accountRepository.getByIdWithCharacters(accountId);

  return account.characters;
}

export async function login(
  email: string,
  password: string,
  repoFactory = RepositoryFactory.Default
) {
  const accountRepository = repoFactory.getAccountRepository();

  const loginDi = {
    tokenizer: jwtTokenizer,
    encryptor: bCryptEncrypter,
    accountRepository,
  };
  return loginWithPassword(loginDi, email, password);
}

export async function register(
  email: string,
  password: string,
  repoFactory = RepositoryFactory.Default
) {
  const accountRepository = repoFactory.getAccountRepository();

  return registerAccountWithPassword(
    { encryptor: bCryptEncrypter, accountRepository },
    email,
    password
  );
}

export async function verifyToken(token: string) {
  return verifyTokenService({ tokenizer: jwtTokenizer }, token);
}
