import { Account } from '../model/account';
import { LogInAbleAccount } from '../model/log-in-able-account';

export interface AccountQueries {
  loadAccountWithCharacter(account: string): Promise<Account | null>;
  lookForLogInAbleAccountByEmail(
    email: string
  ): Promise<LogInAbleAccount | null>;
  lookForLogInAbleAccountById(
    account: string
  ): Promise<LogInAbleAccount | null>;
}
