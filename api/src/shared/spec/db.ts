import * as authContext from '../../modules/auth/auth.context';

export async function registerUser(email: string, password = 'pass123') {
  return authContext.registerUser(email, password);
}
