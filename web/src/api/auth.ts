import * as api from './client';

export function registerUser(email: string, password: string) {
  return api.post('/users', { email, password });
}

export function logIn(email: string, password: string) {
  return api.post('/session', { email, password });
}
