export class Account {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly isAdmin: boolean;
  constructor(
    id: string,
    email: string,
    passwordHash: string,
    isAdmin: boolean
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isAdmin = isAdmin;
  }
}
