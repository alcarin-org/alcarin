export class DomainError {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
  isSuccessfullyCasted() {
    return true;
  }
}
