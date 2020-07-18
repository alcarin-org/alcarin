import { Connection, EntityManager } from 'typeorm';
import { identifierProvider } from '@/application/plugins/shared/uuid-identifier-provider/identifier-provider';
import {
  CharacterRepository,
  RaceParser,
} from '@/server/db/repository/character.repository';
import { AccountRepository } from '@/server/db/repository/account.repository';
import { getDefaultConnection } from '@/server/db';
import { getAvailableRaces, AvailableRace } from '@/domain/game/character/race';

const availableRaceParser: RaceParser = {
  parse(raceKey: string) {
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

export class RepositoryFactory {
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
