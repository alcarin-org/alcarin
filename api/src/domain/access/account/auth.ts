import { AccountRepository } from './account.repository';
import { Tokenizer, PasswordEncryptor } from './tools';
import { Account } from './account';

function canLogin(
  account: Account,
  passwordCandidate: string,
  encryptor: PasswordEncryptor
): Promise<boolean> {
  return encryptor.isPasswordMatch(account.passwordHash, passwordCandidate);
}

type loginWithPasswordDI = {
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

  throw new Error('invalid login data');
}

type registerAccountWithPasswordDI = {
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

type VerifyTokenDI = {
  tokenizer: Tokenizer;
};

export async function verifyToken(di: VerifyTokenDI, token: string) {
  const { tokenizer } = di;
  const tokenPayload = await tokenizer.readToken(token);
  return tokenPayload;
}
