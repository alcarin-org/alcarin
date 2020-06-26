import { start } from 'repl';

import { Connection } from 'typeorm';

import { createDatabaseConnection, Repos } from '../src/db';
import * as Entities from '../src/db/entities';

createDatabaseConnection().then((connection: Connection) => {
  const context = start('$ ').context;

  Object.assign(context, {
    connection,
    manager: connection.manager,
    repos: { ...Repos },
    ...Entities,
  });
  console.info('Db connection initialized');
});
