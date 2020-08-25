import { AccountModuleApi } from '@/alcarin/account';

import { AuthorizationService } from '../application/authorization.service';

import { createJwtTokenizer } from './tokenizer/jwt-tokenizer-service';
import { adjustAccountModule } from './account-module';

export function AuthorizationModuleFactory(
  authKey: string,
  baseUrl: string,
  expireSec: number,
  accountModule: AccountModuleApi
) {
  const tokenizer = createJwtTokenizer(authKey, baseUrl, expireSec);
  const accountModuleAdjusted = adjustAccountModule(accountModule);
  return AuthorizationService(tokenizer, accountModuleAdjusted);
}
