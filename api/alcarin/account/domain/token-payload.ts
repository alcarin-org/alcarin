export class TokenPayload {
  readonly accountId: string;
  readonly isAdmin: boolean;
  public constructor(accountId: string, isAdmin: boolean) {
    this.accountId = accountId;
    this.isAdmin = isAdmin;
  }
}
