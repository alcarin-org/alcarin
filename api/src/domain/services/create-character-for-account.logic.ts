import { AccountRepository } from '@/domain/access/account/account.repository';
import {
  createCharacter,
  createCharacterDI,
} from '@/domain/game/services/create-character.logic';

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

  await accountRepository.saveAccount({
    ...account,
    // MARCHW: do we really need to check if the list will be unique?
    // IMO not. the api should throw an error in such case instead of quitely ignore it.
    // and the error should go from database unique constrain that
    // should be at accountId+characterId columns
    characters: [...new Set([...account.characters, character.id])],
  });

  return character;
}
