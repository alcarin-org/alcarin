import { AccountModuleApi } from '@/alcarin/account';

import { AuthenticationService } from '../application/authentication-service';

import { adjustAccountModule } from './account-module';
import { bCryptEncrypterFactory } from './password-encycrypters/bcrypt-encrypter';

export function AuthenticationModuleFactory(
  accountModule: AccountModuleApi,
  bCryptRounds: number
) {
  return AuthenticationService(
    adjustAccountModule(accountModule),
    bCryptEncrypterFactory(bCryptRounds)
  );
}
