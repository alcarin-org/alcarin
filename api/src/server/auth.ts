import { Tokenizer, PasswordEncryptor } from './tools';

import {
  queryAccountByEmail,
  queryAccountWithCharacters,
  createAccount,
  selfCreateNormalCharacter,
  createNormalCharacterFor,
  selfCreateGodCharacter,
  LogInAbleAccount,
} from '@/alcarin/account';

function canLogin(
  account: LogInAbleAccount,
  passwordCandidate: string,
  encryptor: PasswordEncryptor
): Promise<boolean> {
  return encryptor.isPasswordMatch(account.passwordHash, passwordCandidate);
}

type loginWithPasswordDI = {
  tokenizer: Tokenizer;
  encryptor: PasswordEncryptor;
};

export async function loginWithPassword(
  di: loginWithPasswordDI,
  email: string,
  password: string
) {
  const { encryptor, tokenizer } = di;
  const account = await queryAccountByEmail(email);
  if(!account) {

  }
  if (await canLogin(account, password, encryptor)) {
    return tokenizer.createToken({
      accountId: account.id,
    });
  }

  throw new Error('invalid login data');
}

type registerAccountWithPasswordDI = {
  accountRepository: Accounts;
  encryptor: PasswordEncryptor;
};

export async function registerAccountWithPassword(
  di: registerAccountWithPasswordDI,
  email: string,
  password: string
) {
  const { accountRepository, encryptor } = di;
  const passwordHash = await encryptor.hashPassword(password);
  const account = await accountRepository.create(email, passwordHash);
  return accountRepository.save(account);
}

type VerifyTokenDI = {
  tokenizer: Tokenizer;
};

export async function verifyToken(di: VerifyTokenDI, token: string) {
  const { tokenizer } = di;
  const tokenPayload = await tokenizer.readToken(token);
  return tokenPayload;
}
