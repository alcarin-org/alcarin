import { TokenPayload } from './token-payload.vo';

export interface Tokenizer {
  createToken(payload: TokenPayload): Promise<string>;
  readToken(token: string): Promise<TokenPayload>;
}
