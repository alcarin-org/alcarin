import { AccountQueries } from '../application/query/account-queries';
import { Account } from '../application/model/account';
import { LogInAbleAccount } from '../application/model/log-in-able-account';

function loadAccountWithCharacter(account: string): Promise<Account | null> {
  return null;
}
function lookForLogInAbleAccount(
  email: string
): Promise<LogInAbleAccount | null> {
  return null;
}

export const accountQueriesImplementation: AccountQueries = {
  loadAccountWithCharacter,
  lookForLogInAbleAccountByEmail: lookForLogInAbleAccount,
};
