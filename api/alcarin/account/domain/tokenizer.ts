import { TokenPayload } from './token-payload';
import { BearerToken } from './bearer-token';

export interface Tokenizer {
  createBearerToken(payload: TokenPayload): Promise<BearerToken>;
  readToken(accessToken: string): Promise<TokenPayload>;
}
