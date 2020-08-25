import { AccountsService } from '../application/accounts.service';

import { accountQueriesImplementation } from './account-queries';
import { accountRepositoryModule } from './account-repository';
import { charactersModule } from './characters-module';

export function AccountsModuleFactory() {
  return AccountsService(
    accountQueriesImplementation,
    accountRepositoryModule,
    charactersModule
  );
}
