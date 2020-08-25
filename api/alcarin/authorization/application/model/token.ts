export class Token {
  readonly tokenString: string;
  readonly tokenType: string;
  readonly expiredAt: number;
  private constructor(token: string, tokenType: string, expiredAt: number) {
    this.tokenString = token;
    this.tokenType = tokenType;
    this.expiredAt = expiredAt;
  }

  public static Bearer(token: string, expiredAt: number) {
    return new Token(token, 'Bearer', expiredAt);
  }
}
