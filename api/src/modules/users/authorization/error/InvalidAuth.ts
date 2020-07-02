export class InvalidAuth extends Error {
  constructor() {
    super('Invalid email or password');
  }
}
