import { PasswordEncryptor } from '../domain/password-encrypter';
import { createWithSpecification } from '../domain/account-with-password-specification';
import { changePasswordHash, isPasswordMatch } from '../domain/account';
import { Accounts } from '../domain/accounts';
import { Tokenizer } from '../domain/tokenizer';

import { InvalidLoginData } from './errors/invalid-login-data';
import { BearerToken } from './model/bearer-token';

export function AccountsService(
  accountsRepository: Accounts,
  passwordEncrypter: PasswordEncryptor,
  tokenizer: Tokenizer
) {
  async function loginWithPassword(email: string, password: string) {
    const account = await accountsRepository.getByEmail(email);
    if (!account) {
      throw new InvalidLoginData();
    }

    if (await isPasswordMatch(account, passwordEncrypter, password)) {
      return new BearerToken(
        await tokenizer.createBearerToken({
          accountId: account.id,
          isAdmin: account.isAdmin,
        })
      );
    }
    throw new InvalidLoginData();
  }

  async function isSessionValid(token: string) {
    try {
      const tokenPayload = await tokenizer.readToken(token);
      const account = await accountsRepository.getById(tokenPayload.accountId);
      if (account === null) {
        throw new Error('session unrecognized');
      }

      return tokenPayload.accountId;
    } catch (e) {
      throw new Error('session unrecognized');
    }
  }

  async function changePassword(email: string, passwordCandidate: string) {
    let account = await accountsRepository.getByEmail(email);

    if (!account) {
      throw new InvalidLoginData();
    }

    account = await changePasswordHash(
      account,
      passwordEncrypter,
      passwordCandidate
    );
    await accountsRepository.save(account);
  }
  async function registerWithPassword(email: string, passwordHash: string) {
    const account = await createWithSpecification(
      accountsRepository,
      passwordEncrypter,
      email,
      passwordHash
    );

    return accountsRepository.save(account);
  }

  return {
    loginWithPassword,
    isSessionValid,
    changePassword,
    registerWithPassword,
  };
}
