export class BearerToken {
  readonly accessToken: string;
  readonly tokenType: 'Bearer';
  readonly expiresAt: number;

  constructor({
    accessToken,
    expiresAt,
  }: {
    accessToken: string;
    expiresAt: number;
  }) {
    this.accessToken = accessToken;
    this.expiresAt = expiresAt;
  }
}
