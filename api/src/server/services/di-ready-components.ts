import { createAccountRepository } from '@/server/db/repository/access/account.repository';
import { createEntityCharacterRepository } from '@/server/db/repository/game/character.repository';
import { identifierProvider } from '@/server/plugins/shared/uuid-identifier-provider/identifier-provider';
import {
  raceKeyProvider,
  AvailableRace,
} from '@/server/plugins/game/races/available-race-provider';
import { AccountRepository } from '@/domain/access/account/account.repository';
import { CharacterRepository } from '@/domain/game/character/character.repository';

export let accountRepository: AccountRepository;
export let characterRepository: CharacterRepository<AvailableRace>;

export function initializeDIAfterDBLoad() {
  accountRepository = createAccountRepository(identifierProvider);
  characterRepository = createEntityCharacterRepository(
    raceKeyProvider,
    identifierProvider
  );
}
