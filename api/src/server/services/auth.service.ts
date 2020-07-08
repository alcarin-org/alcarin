import {
  verifyTokenDI,
  verifyToken as verifyTokenService,
} from 'src/domain/services/verify-token-payload.logic';
import { jwtTokenizer } from './di-ready-components';

const verifyTokenDI: verifyTokenDI = {
    tokenizer: jwtTokenizer
}

export function verifyToken(token: string) {
    return verifyTokenService(verifyTokenDI, token)
}