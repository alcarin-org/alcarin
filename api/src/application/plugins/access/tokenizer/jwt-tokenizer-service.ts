import { sign, verify } from 'jsonwebtoken';
import { envVars } from '@/server/core/env-vars';
import {
  Tokenizer,
  TokenPayloadType,
} from '@/domain/access/tools/tokenizer.tool';

export function createJwtTokenizer(): Tokenizer {
  const payloadOptions = {
    issuer: envVars.URL_BASE,
    audience: envVars.URL_BASE,
    expiresIn: envVars.AUTH_EXPIRATION_SEC,
  };

  async function createToken(payload: TokenPayloadType): Promise<string> {
    return sign(payload, envVars.AUTH_KEY, payloadOptions);
  }

  async function readToken(token: string): Promise<TokenPayloadType> {
    const payload = verify(token, envVars.AUTH_KEY, payloadOptions);
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
  payload: string | object | TokenPayloadType
): payload is TokenPayloadType {
  return (payload as TokenPayloadType).accountId !== undefined;
}

export const jwtTokenizer = createJwtTokenizer();
