export interface PasswordEncryptor {
  hashPassword(passwordCandidate: string): Promise<string>;

  isPasswordMatch(
    currentPasswordHash: string,
    passwordCandidate: string
  ): Promise<boolean>;
}

export interface Tokenizer {
  createToken(payload: TokenPayloadType): Promise<string>;
  readToken(token: string): Promise<TokenPayloadType>;
}

export interface TokenPayloadType {
  accountId: string;
}
