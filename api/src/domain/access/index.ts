import { AccountRepository } from '@/domain/access/account/account.repository';
import { canLogin } from '@/domain/access/account/account';
import { Tokenizer } from '@/domain/access/tools/tokenizer.tool';
import { PasswordEncryptor } from '@/domain/access/tools/password-encryptor.tool';

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
