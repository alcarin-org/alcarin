export class SessionData {
  readonly isAdmin: boolean;
  readonly accountId: string;
  private constructor(accountId: string, isAdmin: boolean) {
    this.accountId = accountId;
    this.isAdmin = isAdmin;
  }

  public static NormalAccountSessionData(accountId: string) {
    return new SessionData(accountId, false);
  }

  public static AdminAccountSessionData(accountId: string) {
    return new SessionData(accountId, true);
  }
}
