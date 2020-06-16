import * as api from './client';

interface AuthReqParams {
  email: string;
  password: string;
}

interface LogInRes {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
}

export async function registerUser({ email, password }: AuthReqParams) {
  return api.post('/users', { email, password });
}

export async function logInUser({ email, password }: AuthReqParams) {
  return api.post<LogInRes>('/session', { email, password });
}
