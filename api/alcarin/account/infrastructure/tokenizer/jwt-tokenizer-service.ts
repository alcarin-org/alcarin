import { sign, verify } from 'jsonwebtoken';

import { Tokenizer } from '../../domain/tokenizer';
import { TokenPayload } from '../../domain/token-payload';
import { BearerToken } from '../../domain/bearer-token';

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

  async function createBearerToken(
    payload: TokenPayload
  ): Promise<BearerToken> {
    return {
      accessToken: sign(payload, authKey, payloadOptions),
      tokenType: 'Bearer',
      expiresAt: Math.trunc(Date.now() / 1000 + expireSec),
    };
  }

  async function readToken(token: string): Promise<TokenPayload> {
    const payload = verify(token, authKey, payloadOptions);
    if (isTokenPayload(payload)) {
      return { accountId: payload.accountId, isAdmin: payload.isAdmin };
    }

    throw new Error('invalid token');
  }

  return {
    createBearerToken,
    readToken,
  };
}

function isTokenPayload(
  payload: string | object | TokenPayload
): payload is TokenPayload {
  return (payload as TokenPayload).accountId !== undefined;
}
