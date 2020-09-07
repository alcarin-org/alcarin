import { start } from 'repl';

import { Connection } from 'typeorm';

import { createDatabaseConnection } from '../db';
// import * as Entities from '../src/server/db/entities';

createDatabaseConnection().then((connection: Connection) => {
  const context = start('$ ').context;

  Object.assign(context, {
    connection,
    manager: connection.manager,
    // ...Entities,
  });
  console.info('Db connection initialized');
});
