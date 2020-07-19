import { AccountRepository as DomainAccountRepository } from '@/domain/access/account/account.repository';
import { Account } from '@/domain/access/account';
import { Character } from '@/domain/game/character';
import { CharacterRepository } from '@/domain/game/character/character.repository';
import { GameTimeRepository } from '@/domain/game/game-time/game-time.repository.d';

interface AccountWithCharacters extends Account {
  characters: Character[];
}

interface AccountRepository extends DomainAccountRepository {
  getByIdWithCharacters(id: string): Promise<AccountWithCharacters>;
}

export interface RepositoryFactory {
  getAccountRepository(): AccountRepository;
  getCharacterRepository(): CharacterRepository;
  getGameTimeRepository(): GameTimeRepository;
}

export interface TransactionBoundary {
  transaction<TResult>(
    call: (repo: RepositoryFactory) => Promise<TResult>
  ): Promise<TResult>;
}
