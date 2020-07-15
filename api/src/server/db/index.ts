import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import ormconfig from '@/../ormconfig';

import { UniversePropertyRepository } from './repository/game/universe-property-repository';
import { RepositoryFactory } from './repository-factory';

export { RepositoryFactory };

type ReposType = {
  UniversePropertyRepo: UniversePropertyRepository;
};

export let connection: Connection;
export let UniversePropertyRepo: UniversePropertyRepository;
export let Repos: ReposType;

export async function createDatabaseConnection(
  options?: Partial<ConnectionOptions>
) {
  connection = await createConnection({
    ...ormconfig,
    ...options,
  } as ConnectionOptions);

  RepositoryFactory.setDefaultConnection(connection);

  UniversePropertyRepo = connection.getCustomRepository(
    UniversePropertyRepository
  );

  Repos = { UniversePropertyRepo };

  return connection;
}
