import { Connection, EntityManager } from 'typeorm';
import { identifierProvider } from '@/server/plugins/shared/uuid-identifier-provider/identifier-provider';
import { raceKeyProvider } from '@/server/plugins/game/races/available-race-provider';
import { createEntityCharacterRepository } from '@/server/db/repository/game/character.repository';
import { createAccountRepository } from '@/server/db/repository/access/account.repository';

export class RepositoryFactory {
  private static DefaultConnectionInstance: RepositoryFactory;

  private constructor(private context: Connection | EntityManager) {}

  static create(context: Connection | EntityManager) {
    // TODO: add expireable cache
    return new RepositoryFactory(context);
  }

  getAccountRepository() {
    return createAccountRepository(identifierProvider, this.context);
  }

  getCharacterRepository() {
    return createEntityCharacterRepository(raceKeyProvider, identifierProvider);
  }

  public static setDefaultConnection(connection: Connection) {
    RepositoryFactory.DefaultConnectionInstance = new RepositoryFactory(
      connection
    );
  }

  public static get Default() {
    if (!RepositoryFactory.DefaultConnectionInstance) {
      throw new Error('RepositoryFactory has not been initialized yet');
    }
    return RepositoryFactory.DefaultConnectionInstance;
  }
}
