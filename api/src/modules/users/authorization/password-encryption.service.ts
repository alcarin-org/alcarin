export interface PasswordEncryptionService {
  isPasswordMatch(
    currentHashedPassword: string,
    passwordProvided: string
  ): Promise<boolean>;
  hashPassword(passwordProvided: string): Promise<string>;
}
