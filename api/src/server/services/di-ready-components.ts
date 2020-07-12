import { createAccountRepository } from '@/server/db/repository/access/account.repository';
import { createEntityCharacterRepository } from '@/server/db/repository/game/character.repository';
import { bCryptEncrypter } from '@/server/plugins/access/password-encycrypters/bcrypt-encrypter';
import { jwtTokenizer } from '@/server/plugins/access/tokenizer/jwt-tokenizer-service';
import { identifierProvider } from '@/server/plugins/shared/uuid-identifier-provider/identifier-provider';
import {
  AvailableRace,
  raceKeyProvider,
} from '@/server/plugins/game/races/available-race-provider';
import { AccountRepository } from '@/domain/access/account/account.repository';
import { CharacterRepository } from '@/domain/game/character/character.repository';

export { identifierProvider, AvailableRace, bCryptEncrypter, jwtTokenizer };
export let accountRepository: AccountRepository;
export let characterRepository: CharacterRepository<AvailableRace>;

export function initializeDIAfterDBLoad() {
  accountRepository = createAccountRepository(identifierProvider);
  characterRepository = createEntityCharacterRepository<AvailableRace>(
    raceKeyProvider,
    identifierProvider
  );
}
