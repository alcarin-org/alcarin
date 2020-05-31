import { start } from 'repl';

import { Connection } from 'typeorm';

import { createDatabaseConnection, UserRepo } from '../src/db';
import { User } from '../src/db/entities/user';

createDatabaseConnection().then((connection: Connection) => {
  const context = start('$ ').context;

  Object.assign(context, {
    connection,
    manager: connection.manager,
    repos: { UserRepo },
    User,
  });
  console.info('Db connection initialized');
});
