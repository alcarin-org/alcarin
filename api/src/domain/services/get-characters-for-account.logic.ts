import { AccountRepository } from '../access/account/account.repository';
import { CharacterRepository } from '../game/character/character.repository';

export type getAccountCharactersDI<TRaceKey> = {
  accountRepository: AccountRepository;
  characterRepository: CharacterRepository<TRaceKey>;
};

export async function getAccountCharacters<TRaceKey>(
  di: getAccountCharactersDI<TRaceKey>,
  accountId: string
) {
  const { accountRepository, characterRepository } = di;

  const account = await accountRepository.getById(accountId);
  return characterRepository.getMultipleByIds(account.characters);
}
