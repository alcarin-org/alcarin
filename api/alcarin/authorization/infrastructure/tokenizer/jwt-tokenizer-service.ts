import { sign, verify } from 'jsonwebtoken';

import { Tokenizer } from '../../domain/tokenizer';
import { TokenPayload } from '../../domain/token-payload.vo';

export function createJwtTokenizer(
  authKey: string,
  baseUrl: string,
  expireSec: number
): Tokenizer {
  const payloadOptions = {
    issuer: baseUrl,
    audience: baseUrl,
    expiresIn: expireSec,
  };

  async function createToken(payload: TokenPayload): Promise<string> {
    return sign(payload, authKey, payloadOptions);
  }

  async function readToken(token: string): Promise<TokenPayload> {
    const payload = verify(token, authKey, payloadOptions);
    if (isTokenPayload(payload)) {
      return { accountId: payload.accountId };
    }

    throw new Error('invalid token');
  }

  return {
    createToken,
    readToken,
  };
}

function isTokenPayload(
  payload: string | object | TokenPayload
): payload is TokenPayload {
  return (payload as TokenPayload).accountId !== undefined;
}
