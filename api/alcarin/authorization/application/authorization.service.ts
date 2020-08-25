import { DomainError } from '@/alcarin/shared/domain/domain-error';
import { SessionData } from '@/alcarin/authorization/application/model/session-data';

import { Tokenizer } from '../domain/tokenizer';
import { Accounts } from '../domain/accounts.module';

export function AuthorizationService(tokenizer: Tokenizer, accounts: Accounts) {
  async function readToken(token: string) {
    const tokenPayload = await tokenizer.readToken(token);
    const account = await accounts.getAccountById(tokenPayload.accountId);
    if (account === null) {
      throw new DomainError('Invalid Token');
    }

    if (account.isAdmin) {
      return SessionData.AdminAccountSessionData(tokenPayload.accountId);
    } else {
      return SessionData.NormalAccountSessionData(tokenPayload.accountId);
    }
  }

  async function createLoginToken(accountId: string) {
    const account = await accounts.getAccountById(accountId);
    if (account === null) {
      throw new DomainError('Invalid Account');
    }

    if (account.isAdmin) {
      return SessionData.AdminAccountSessionData(accountId);
    } else {
      return SessionData.NormalAccountSessionData(accountId);
    }
  }

  return { readToken, createLoginToken };
}
