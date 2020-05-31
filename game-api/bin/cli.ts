import { start } from 'repl';

import { Connection } from 'typeorm';

import {
  createDatabaseConnection,
  SharedMailboxRepo,
  SharedMailboxUserRepo,
  UserRepo,
} from '../src/db';
import { SharedMailbox } from '../src/db/entities/shared-mailbox';
import { SharedMailboxUser } from '../src/db/entities/shared-mailbox-user';
import { User } from '../src/db/entities/user';

createDatabaseConnection().then((connection: Connection) => {
  const context = start('$ ').context;

  Object.assign(context, {
    connection,
    manager: connection.manager,
    repos: { UserRepo, SharedMailboxRepo, SharedMailboxUserRepo },
    User,
    SharedMailbox,
    SharedMailboxUser,
  });
  console.info('Db connection initialized');
});
