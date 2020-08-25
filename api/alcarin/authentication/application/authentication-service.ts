import { passwordService } from '../domain/password.service';
import { Accounts } from '../domain/accounts.module';
import { PasswordEncryptor } from '../domain/password-encrypter.module';

export function AuthenticationService(
  accounts: Accounts,
  passwordEncrypter: PasswordEncryptor
) {
  async function loginWithPassword(email: string, password: string) {
    return passwordService.login(accounts, passwordEncrypter, email, password);
  }

  async function changePassword(email: string, passwordCandidate: string) {
    return passwordService.changePassword(
      accounts,
      passwordEncrypter,
      email,
      passwordCandidate
    );
  }

  return { loginWithPassword, changePassword };
}
