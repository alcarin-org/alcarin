export type PasswordEncryptor = {
    hashPassword(passwordCandidate: string): Promise<string>;
    isPasswordMatch(currentPassword: string, passwordCandidate: string): Promise<boolean>;
}
