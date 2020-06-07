import * as api from './client';

type AuthCall = {
  email: string;
  password: string;
};
export async function registerUser({ email, password }: AuthCall) {
  return api.post('/users', { email, password });
}

export function logIn({ email, password }: AuthCall) {
  return api.post('/session', { email, password });
}
