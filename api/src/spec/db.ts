import {register, login} from 'src/server/services/account-access.service';

export async function registerAccount(email: string, password = 'pass123') {
  return register(email, password);
}

export async function createTestAccountAndLogin() {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  await register(testEmail, testPassword);

  return login(testEmail, testPassword);
}
