export class EmailAlreadyExists extends Error {
  constructor() {
    super('We have account with that email');
  }
}
