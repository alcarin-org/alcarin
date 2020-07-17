import { Connection, EntityManager } from 'typeorm';
import { identifierProvider } from '@/server/plugins/shared/uuid-identifier-provider/identifier-provider';
import { raceKeyProvider } from '@/server/plugins/game/races/available-race-provider';
import { CharacterRepository } from '@/server/db/repository/character.repository';
import { AccountRepository } from '@/server/db/repository/account.repository';
import { getDefaultConnection } from '@/server/db';

export class RepositoryFactory {
  private static DefaultConnectionInstance: RepositoryFactory;

  private constructor(private context: Connection | EntityManager) {}

  static create(context: Connection | EntityManager) {
    // TODO: add expireable cache
    return new RepositoryFactory(context);
  }

  getAccountRepository() {
    return new AccountRepository(identifierProvider, this.context);
  }

  getCharacterRepository() {
    return new CharacterRepository(
      identifierProvider,
      raceKeyProvider,
      this.context
    );
  }

  public static get Default() {
    if (!RepositoryFactory.DefaultConnectionInstance) {
      const defaultConnection = getDefaultConnection();
      if (!defaultConnection) {
        throw new Error('Database connection has not been initialized yet');
      }
      RepositoryFactory.DefaultConnectionInstance = new RepositoryFactory(
        defaultConnection
      );
    }
    return RepositoryFactory.DefaultConnectionInstance;
  }
}
