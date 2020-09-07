import { setPrivilegesToStandard } from './account';
import { EmailAlreadyExists } from './errors';
import { Accounts } from './accounts';
import { PasswordEncryptor } from './password-encrypter';

export async function createWithSpecification(
  accounts: Accounts,
  passwordEncrypter: PasswordEncryptor,
  email: string,
  password: string
) {
  const isAccount = await accounts.getByEmail(email);
  if (isAccount) {
    throw new EmailAlreadyExists();
  }

  const hashPassword = await passwordEncrypter.hashPassword(password);
  const account = await accounts.create(email, hashPassword);
  return setPrivilegesToStandard(account);
}
