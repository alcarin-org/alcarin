import { register, login } from '@/application/account-access.service';
import { TransactionBoundary } from '@/../../alcarin/server/repository-factory';

export async function registerAccount(email: string, password = 'pass123') {
  return register(email, password, TransactionBoundary.Default);
}

export async function createTestAccountAndLogin() {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  await register(testEmail, testPassword, TransactionBoundary.Default);

  return login(testEmail, testPassword, TransactionBoundary.Default);
}
