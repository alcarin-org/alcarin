import { AccountsService } from '../application/accounts.service';

import { createJwtTokenizer } from './tokenizer/jwt-tokenizer-service';
import { bCryptEncrypterFactory } from './password-encycrypters/bcrypt-encrypter';
import { accountRepository } from './typeorm/account-repository';

export function AccountsModuleFactory(
  authKey: string,
  baseUrl: string,
  expireSec: number,
  bCryptRounds: number
) {
  bCryptEncrypterFactory(bCryptRounds);
  return AccountsService(
    accountRepository,
    bCryptEncrypterFactory(bCryptRounds),
    createJwtTokenizer(authKey, baseUrl, expireSec)
  );
}
