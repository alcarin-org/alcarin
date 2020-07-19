import { Character } from '@/domain/game/character';
import { AvailableRace } from '@/domain/game/character/race';
import * as characterContext from '@/domain/game/character';
import { auth, addCharacter } from '@/domain/access/account';

import { bCryptEncrypter } from './plugins/access/password-encycrypters/bcrypt-encrypter';
import { jwtTokenizer } from './plugins/access/tokenizer/jwt-tokenizer-service';
import { TransactionBoundary } from './repository-factory';

export async function createCharacter(
  accountId: string,
  name: string,
  raceKey: AvailableRace,
  boundary: TransactionBoundary
) {
  return boundary.transaction(async repoFactory => {
    const accountRepository = repoFactory.getAccountRepository();
    const characterRepository = repoFactory.getCharacterRepository();

    const character = await characterContext.createCharacter(
      { characterRepository },
      name,
      raceKey
    );

    const account = await accountRepository.getById(accountId);

    await accountRepository.saveAccount(addCharacter(account, character));

    return character;
  });
}

export async function getCharacters(
  accountId: string,
  boundary: TransactionBoundary
): Promise<Character[]> {
  return boundary.transaction(async repoFactory => {
    const accountRepository = repoFactory.getAccountRepository();

    const account = await accountRepository.getByIdWithCharacters(accountId);

    return account.characters;
  });
}

export async function login(
  email: string,
  password: string,
  boundary: TransactionBoundary
) {
  return boundary.transaction(repoFactory => {
    const accountRepository = repoFactory.getAccountRepository();

    const loginDi = {
      tokenizer: jwtTokenizer,
      encryptor: bCryptEncrypter,
      accountRepository,
    };
    return auth.loginWithPassword(loginDi, email, password);
  });
}

export async function register(
  email: string,
  password: string,
  boundary: TransactionBoundary
) {
  return boundary.transaction(repoFactory => {
    const accountRepository = repoFactory.getAccountRepository();

    return auth.registerAccountWithPassword(
      { encryptor: bCryptEncrypter, accountRepository },
      email,
      password
    );
  });
}

export async function verifyToken(token: string) {
  return auth.verifyToken({ tokenizer: jwtTokenizer }, token);
}
