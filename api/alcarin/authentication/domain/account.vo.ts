export class Account {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  constructor(id: string, email: string, passwordHash: string) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
  }
}
