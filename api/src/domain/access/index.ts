import { AccountRepository } from './account/account.repository';
import { canLogin, Account } from './account/account';
import { Tokenizer } from './tools/tokenizer.tool';
import { PasswordEncryptor } from './tools/password-encryptor.tool';

export type loginWithPasswordDI = {
  tokenizer: Tokenizer;
  encryptor: PasswordEncryptor;
  accountRepository: AccountRepository;
};

export async function loginWithPassword(
  di: loginWithPasswordDI,
  email: string,
  password: string
) {
  const { accountRepository, encryptor, tokenizer } = di;
  const account = await accountRepository.getByEmail(email);
  if (await canLogin(account, password, encryptor)) {
    return tokenizer.createToken({
      accountId: account.id,
    });
  }

  throw 'invalid login data';
}

export type registerAccountWithPasswordDI = {
  accountRepository: AccountRepository;
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
  return accountRepository.saveAccount(account);
}

export type VerifyTokenDI = {
  tokenizer: Tokenizer;
};

export async function verifyToken(di: VerifyTokenDI, token: string) {
  const { tokenizer } = di;
  const tokenPayload = await tokenizer.readToken(token);
  return tokenPayload;
}

export function addCharacter(
  account: Account,
  character: { id: string }
): Account {
  return {
    ...account,
    characters: [...account.characters, character],
  };
}
