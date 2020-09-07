import { Connection, createConnection, ConnectionOptions } from 'typeorm';

import ormconfig from './ormconfig';

let connection: Connection | null = null;

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

  return connection;
}
