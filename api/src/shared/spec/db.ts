import * as authContext from '../../modules/auth/auth.context';

export async function registerUser(email: string, password = 'pass123') {
  return authContext.registerUser(email, password);
}

export async function createTestUserAndLogin() {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  await authContext.registerUser(testEmail, testPassword);

  return authContext.logInUser(testEmail, testPassword);
}
