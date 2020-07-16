export interface Tokenizer {
  createToken(payload: TokenPayloadType): Promise<string>;
  readToken(token: string): Promise<TokenPayloadType>;
}

export interface TokenPayloadType {
  accountId: string;
}
