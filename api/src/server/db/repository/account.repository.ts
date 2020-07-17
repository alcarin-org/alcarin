import { Connection, EntityManager } from 'typeorm';
import { AccountRepository } from '@/domain/access/account/account.repository';
import { Account } from '@/domain/access/account/account';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';

import {
  AccountRelations,
  Account as AccountEntity,
} from '../entities/account';
import { Character as CharacterEntity } from '../entities/character';
import { getDefaultConnection } from '..';

export const createAccountRepository = (
  IdentifierProviderService: IdentifierProviderService,
  dbConnection: Connection | EntityManager | null = getDefaultConnection()
): AccountRepository => {
  if (!dbConnection) {
    throw new Error('Database not ready yet');
  }

  const createAccount = createNewAccount(IdentifierProviderService);
  const accountRepository = dbConnection.getRepository(AccountEntity);

  async function create(email: string, passwordHash: string) {
    return createAccount(email, passwordHash);
  }

  async function getByEmail(email: string) {
    const account = await accountRepository.findOneOrFail(
      { email },
      { relations: [AccountRelations.Characters] }
    );
    return account;
  }

  async function getById(id: string) {
    const account = await accountRepository.findOneOrFail(
      { id },
      { relations: [AccountRelations.Characters] }
    );
    return account;
  }

  async function saveAccount(account: Account) {
    const entity = mapFromAccountToEntity(account);
    const newEntity = await accountRepository.save(entity);
    return newEntity;
  }

  return {
    getByEmail,
    create,
    saveAccount,
    getById,
  };
};

function createNewAccount(
  identifierProviderService: IdentifierProviderService
) {
  return (email: string, passwordHash: string) => {
    return {
      id: identifierProviderService.genIdentifier(),
      email,
      passwordHash,
      characters: [],
    };
  };
}

function mapFromAccountToEntity(account: Account) {
  const accountEntity = new AccountEntity();
  accountEntity.id = account.id;
  accountEntity.email = account.email;
  accountEntity.passwordHash = account.passwordHash;
  accountEntity.characters = account.characters.map(
    mapFromAccountCharacterToEntity
  );

  return accountEntity;
}

function mapFromAccountCharacterToEntity(character: { id: string }) {
  const accountEntity = new CharacterEntity();
  accountEntity.id = character.id;
  return accountEntity;
}
