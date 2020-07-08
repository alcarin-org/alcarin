import { AccountRepository } from 'src/domain/access/account/account.repository';
import {
  createCharacter,
  createCharacterDI,
} from 'src/domain/game/services/create-character.logic';
import { addCharacter } from 'src/domain/access/account/account';

export type createCharacterForAccountDI<TRaceKey> = {
  accountRepository: AccountRepository;
} & createCharacterDI<TRaceKey>;

export async function createCharacterForAccount<TRaceKey>(
  di: createCharacterForAccountDI<TRaceKey>,
  accountId: string,
  name: string,
  race: TRaceKey
) {
  const { accountRepository } = di;
  const character = await createCharacter(di, name, race);

  let account = await accountRepository.getById(accountId);
  account = addCharacter(account, character.id);
  await accountRepository.saveAccount(account);
}
