import { Connection, EntityManager } from 'typeorm';
import { identifierProvider } from '@/../../alcarin/shared/infrastructure/uuid-identifier-provider/identifier-provider';
import { getDefaultConnection } from './db';
import {
  CharacterRepository,
  RaceParser,
} from './db/repository/character.repository';
import { AccountRepository } from './db/repository/account.repository';
import { GameTimeRepository } from './db/repository/universe-property/game-time.repository';
import { AvailableRace } from '@/../../alcarin/character/domain/race';
import { getAvailableRaces } from '@/../../alcarin/character/domain';
import {
  RepositoryFactory as ApplicationRepositoryFactory,
  TransactionBoundary as ApplicationTransactionBoundary,
} from '../application/repository-factory';

const availableRaceParser: RaceParser = {
  parse(raceKey: string) {
    // potential problem: we using domain code directly here is it a problem, or not?
    const parsedRace = getAvailableRaces().find(value => value == raceKey);
    if (parsedRace === undefined) {
      throw new Error(`Invalid race "${raceKey}"`);
    }

    return parsedRace;
  },

  stringify(raceKey: AvailableRace) {
    return raceKey.toString();
  },
};

export class RepositoryFactory implements ApplicationRepositoryFactory {
  private static DefaultConnectionInstance: RepositoryFactory;

  private constructor(private context: Connection | EntityManager) {}

  static create(context: Connection | EntityManager) {
    // TODO: add expireable cache
    return new RepositoryFactory(context);
  }

  getAccountRepository() {
    return new AccountRepository(
      identifierProvider,
      availableRaceParser,
      this.context
    );
  }

  getCharacterRepository() {
    return new CharacterRepository(
      identifierProvider,
      availableRaceParser,
      this.context
    );
  }

  getGameTimeRepository() {
    return new GameTimeRepository(this.context);
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

export class TransactionBoundary implements ApplicationTransactionBoundary {
  private static instance: TransactionBoundary;

  public static get Default() {
    return new TransactionBoundary();
  }

  async transaction<TResult>(
    call: (repo: RepositoryFactory) => Promise<TResult>
  ): Promise<TResult> {
    const defaultConnection = getDefaultConnection();
    if (!defaultConnection) {
      throw new Error('Database connection has not been initialized yet');
    }
    return defaultConnection.transaction(async entityManager =>
      call(RepositoryFactory.create(entityManager))
    );
  }
}
