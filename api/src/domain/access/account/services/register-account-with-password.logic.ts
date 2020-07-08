import { AccountRepository } from 'src/domain/access/account/account.repository';
import { PasswordEncryptor } from 'src/domain/access/tools/password-encryptor.tool';

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
