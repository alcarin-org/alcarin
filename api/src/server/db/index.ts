import { Connection, createConnection, ConnectionOptions } from 'typeorm';

import ormconfig from 'src/../ormconfig';

import { UniversePropertyRepository } from 'src/server/db/repository/game/universe-property-repository';

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

  UniversePropertyRepo = connection.getCustomRepository(
    UniversePropertyRepository
  );

  Repos = { UniversePropertyRepo };

  return connection;
}
