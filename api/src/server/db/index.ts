import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { UniversePropertyRepository } from '@/server/db/repository/game/universe-property-repository';
import ormconfig from '@/../ormconfig';

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
