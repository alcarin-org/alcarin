import { createAccountRepository } from 'src/server/db/repository/access/account.repository';
import { createEntityCharacterRepository } from 'src/server/db/repository/game/character.repository';
import { bCryptEncrypter } from 'src/server/plugins/access/password-encycrypters/bcrypt-encrypter';
import { jwtTokenizer } from 'src/server/plugins/access/tokenizer/jwt-tokenizer-service';
import { identifierProvider } from 'src/server/plugins/shared/uuid-identifier-provider/identifier-provider';
import {
  AvailableRace,
  raceKeyProvider,
} from 'src/server/plugins/game/races/available-race-provider';
import { AccountRepository } from 'src/domain/access/account/account.repository';
import { CharacterRepository } from 'src/domain/game/character/character.repository';

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
