import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import ormconfig from '@/../ormconfig';

import { UniversePropertyRepository } from './repository/universe-property-repository';

type ReposType = {
  UniversePropertyRepo: UniversePropertyRepository;
};

let connection: Connection | null = null;

export let UniversePropertyRepo: UniversePropertyRepository;
export let Repos: ReposType;

export function getDefaultConnection() {
  return connection;
}

export async function createDatabaseConnection(
  options?: Partial<ConnectionOptions>
) {
  connection = await createConnection({
    ...ormconfig,
    ...options,
  } as ConnectionOptions);

  UniversePropertyRepo = connection.getCustomRepository(
    UniversePropertyRepository
  );

  Repos = { UniversePropertyRepo };

  return connection;
}
