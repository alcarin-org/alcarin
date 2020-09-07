export interface PasswordEncryptor {
  hashPassword(passwordCandidate: string): Promise<string>;

  isPasswordMatch(
    currentPasswordHash: string,
    passwordCandidate: string
  ): Promise<boolean>;
}
