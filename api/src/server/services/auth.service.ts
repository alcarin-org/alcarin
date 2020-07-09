import {
  verifyTokenDI,
  verifyToken as verifyTokenService,
} from 'src/domain/services/verify-token-payload.logic';

import { jwtTokenizer } from './di-ready-components';

export function verifyToken(token: string) {
  const di: verifyTokenDI = {
    tokenizer: jwtTokenizer,
  };
  return verifyTokenService(di, token);
}
