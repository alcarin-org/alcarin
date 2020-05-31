import { Connection, createConnection, ConnectionOptions } from 'typeorm';

import ormconfig from '../../ormconfig';

import { UserRepository } from './repository/user-repository';

export let connection: Connection;

export let UserRepo: UserRepository;

export async function createDatabaseConnection(
  options?: Partial<ConnectionOptions>
) {
  connection = await createConnection({
    ...ormconfig,
    ...options,
  } as ConnectionOptions);

  UserRepo = connection.getCustomRepository(UserRepository);

  return connection;
}
