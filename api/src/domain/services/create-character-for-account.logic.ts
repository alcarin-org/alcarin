import { AccountRepository } from '../access/account/account.repository';
import { createCharacter, createCharacterDI } from '../game';
import { addCharacter } from '../access';

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

  const account = await accountRepository.getById(accountId);

  await accountRepository.saveAccount(addCharacter(account, character));

  return character;
}
