import jsonwebtoken from 'jsonwebtoken';

import { envVars } from '../../shared/env-vars';
import {
  TokenizerService,
  TokenPayloadType,
} from '../../modules/users/authorization/tokenizer.service';

export class JwtTokenizerService implements TokenizerService {
  createToken(payload: TokenPayloadType): string {
    return jsonwebtoken.sign(payload, envVars.AUTH_KEY, {
      issuer: envVars.URL_BASE,
      audience: envVars.URL_BASE,
      expiresIn: envVars.AUTH_EXPIRATION_SEC,
    });
  }
}
