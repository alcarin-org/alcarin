import { getRepository } from 'typeorm';
import { AccountRepository } from '@/domain/access/account/account.repository';
import { Account } from '@/domain/access/account/account';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';

import { Account as AccountEntity } from '../../entities/access/account';
import { AccountCharacter as AccountCharacterEntity } from '../../entities/access/account-character';

export const createAccountRepository = (
  IdentifierProviderService: IdentifierProviderService
): AccountRepository => {
  const createAccount = createNewAccount(IdentifierProviderService);
  const accountRepository = getRepository(AccountEntity);

  async function create(email: string, passwordHash: string) {
    return createAccount(email, passwordHash);
  }

  async function getByEmail(email: string) {
    const account = await accountRepository.findOneOrFail(
      { email },
      { relations: ['characters'] }
    );
    return mapFromEntityToAccount(account);
  }

  async function getById(id: string) {
    const account = await accountRepository.findOneOrFail(
      { id },
      { relations: ['characters'] }
    );
    return mapFromEntityToAccount(account);
  }

  async function saveAccount(account: Account) {
    const entity = mapFromAccountToEntity(account);
    const newEntity = await accountRepository.save(entity);
    return mapFromEntityToAccount(newEntity);
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

function mapFromEntityToAccount(accountEntity: AccountEntity): Account {
  return {
    id: accountEntity.id,
    email: accountEntity.email,
    passwordHash: accountEntity.passwordHash,
    characters: accountEntity.characters.map(el => el.id),
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

function mapFromAccountCharacterToEntity(character: string) {
  const accountEntity = new AccountCharacterEntity();
  accountEntity.id = character;
  return accountEntity;
}
