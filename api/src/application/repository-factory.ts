import { AccountRepository as DomainAccountRepository } from '@/domain/access/account/account.repository';
import { Account } from '@/domain/access/account/account';
import { Character } from '@/domain/game/character/character';
import { CharacterRepository } from '@/domain/game/character/character.repository';

interface AccountWithCharacters extends Account {
  characters: Character[];
}

interface AccountRepository extends DomainAccountRepository {
  getByIdWithCharacters(id: string): Promise<AccountWithCharacters>;
}

export abstract class RepositoryFactory {
  abstract getAccountRepository(): AccountRepository;
  abstract getCharacterRepository(): CharacterRepository;
}
