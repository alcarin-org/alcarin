import {
  VerifyTokenDI,
  verifyToken as verifyTokenService,
} from '@/domain/services/verify-token-payload.logic';

import { jwtTokenizer } from './di-ready-components';

export function verifyToken(token: string) {
  const di: VerifyTokenDI = {
    tokenizer: jwtTokenizer,
  };
  return verifyTokenService(di, token);
}
