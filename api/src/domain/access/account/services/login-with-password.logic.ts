import { AccountRepository } from 'src/domain/access/account/account.repository';
import { canLogin } from 'src/domain/access/account/account';
import { Tokenizer } from 'src/domain/access/tools/tokenizer.tool';
import { PasswordEncryptor } from 'src/domain/access/tools/password-encryptor.tool';

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
