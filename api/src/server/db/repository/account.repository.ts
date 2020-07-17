import { Connection, EntityManager, Repository } from 'typeorm';
import { AccountRepository as AccountRepositoryInterface } from '@/domain/access/account/account.repository';
import { Account } from '@/domain/access/account/account';
import { IdentifierProviderService } from '@/domain/shared/identifier-provider.tool';

import {
  AccountRelations,
  Account as AccountEntity,
} from '../entities/account';
import { Character as CharacterEntity } from '../entities/character';
import { getDefaultConnection } from '..';

import { mapEntityToModel } from './character.repository';

export class AccountRepository implements AccountRepositoryInterface {
  accountRepository: Repository<AccountEntity>;

  constructor(
    private identifierProviderService: IdentifierProviderService,
    dbConnection: Connection | EntityManager | null = getDefaultConnection()
  ) {
    if (!dbConnection) {
      throw new Error('Database not ready yet');
    }

    this.accountRepository = dbConnection.getRepository(AccountEntity);
  }

  async create(email: string, passwordHash: string) {
    return {
      id: this.identifierProviderService.genIdentifier(),
      email,
      passwordHash,
      characters: [],
    };
  }

  async getByEmail(email: string) {
    const account = await this.accountRepository.findOneOrFail(
      { email },
      { relations: [AccountRelations.Characters] }
    );
    return account;
  }

  async getById(id: string) {
    const account = await this.accountRepository
      .createQueryBuilder('account')
      .addSelect('characters.id')
      .leftJoin('account.characters', 'characters')
      .where('account.id = :0', [id])
      .getOne();

    if (!account) {
      // TODO: add db special error
      throw new Error('Entity not found');
    }

    return account;
  }

  async getByIdWithCharacters(id: string) {
    const account = await this.accountRepository.findOneOrFail(
      { id },
      { relations: [AccountRelations.Characters] }
    );
    return {
      ...account,
      characters: account.characters.map(mapEntityToModel),
    };
  }

  async saveAccount(account: Account) {
    const entity = mapFromAccountToEntity(account);
    const newEntity = await this.accountRepository.save(entity);
    return newEntity;
  }
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
