import { register, login } from '@/application/account-access.service';
import { RepositoryFactory } from '@/server/repository-factory';

export async function registerAccount(email: string, password = 'pass123') {
  return register(email, password, RepositoryFactory.Default);
}

export async function createTestAccountAndLogin() {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  await register(testEmail, testPassword, RepositoryFactory.Default);

  return login(testEmail, testPassword, RepositoryFactory.Default);
}
