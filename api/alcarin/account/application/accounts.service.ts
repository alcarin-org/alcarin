import { DomainError } from '@/alcarin/shared/domain/domain-error';

import { Accounts } from '../domain/accounts.repository';
import { createAccountWithPassword } from '../domain/account-creation.service';
import {
  createGodCharacterInAccount,
  createNormalCharacterInAccount,
} from '../domain/character-creation.service';
import { addCharacter } from '../domain/account.aggregate';
import { Race } from '../../shared/domain/race.vo';
import { Characters } from '../domain/characters.module';

import { AccountQueries } from './query/account-queries';

export function AccountsService(
  accountQueries: AccountQueries,
  accountsRepository: Accounts,
  charactersModule: Characters
) {
  async function getAccountByEmail(email: string) {
    return accountQueries.lookForLogInAbleAccountByEmail(email);
  }

  async function getAccountById(email: string) {
    return accountQueries.lookForLogInAbleAccountById(email);
  }

  async function getAccountWithCharacters(accountId: string) {
    return accountQueries.loadAccountWithCharacter(accountId);
  }

  async function createAccount(email: string, passwordHash: string) {
    const account = await createAccountWithPassword(
      accountsRepository,
      email,
      passwordHash
    );
    return accountsRepository.save(account);
  }

  async function selfCreateNormalCharacter(
    accountId: string,
    name: string,
    race: Race
  ) {
    let account = await accountsRepository.getById(accountId);
    account = await createNormalCharacterInAccount(
      charactersModule,
      account,
      account,
      name,
      race
    );
    return accountsRepository.save(account);
  }

  async function createNormalCharacterFor(
    creatorId: string,
    receiverId: string,
    name: string,
    race: Race
  ) {
    const creator = await accountsRepository.getById(creatorId);
    let receiver = await accountsRepository.getById(receiverId);
    receiver = await createNormalCharacterInAccount(
      charactersModule,
      creator,
      receiver,
      name,
      race
    );
    return accountsRepository.save(receiver);
  }

  async function selfCreateGodCharacter(
    accountId: string,
    name: string,
    race: Race
  ) {
    let account = await accountsRepository.getById(accountId);
    const character = await createGodCharacterInAccount(
      charactersModule,
      account,
      account,
      name,
      race
    );
    account = addCharacter(account, character);
    return accountsRepository.save(account);
  }

  async function changePassword(email: string, password: string) {
    throw new DomainError('not implemented yet');
  }

  return {
    queryAccountByEmail: getAccountByEmail,
    queryAccountById: getAccountById,
    queryAccountWithCharacters: getAccountWithCharacters,
    changePassword,
    createAccount,
    selfCreateNormalCharacter,
    createNormalCharacterFor,
    selfCreateGodCharacter,
  };
}
