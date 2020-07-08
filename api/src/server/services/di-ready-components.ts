import { createAccountRepository } from 'src/server/db/repository/access/account.repository';
import { createEntityCharacterRepository } from 'src/server/db/repository/game/character.repository';
import { bCryptEncrypter } from 'src/server/plugins/access/password-encycrypters/bcrypt-encrypter';
import { createJwtTokenizer } from 'src/server/plugins/access/tokenizer/jwt-tokenizer-service';
import { identifierProvider } from 'src/server/plugins/shared/uuid-identifier-provider/identifier-provider';
import {
  AvailableRace,
  raceKeyProvider,
} from 'src/server/plugins/game/races/available-race-provider';

export { identifierProvider, AvailableRace };
export { bCryptEncrypter };
export const jwtTokenizer = createJwtTokenizer();
export const accountRepository = createAccountRepository(identifierProvider);
export const characterRepository = createEntityCharacterRepository<
  AvailableRace
>(raceKeyProvider, identifierProvider);
