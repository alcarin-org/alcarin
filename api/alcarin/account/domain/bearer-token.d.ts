export interface BearerToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: number;
}
