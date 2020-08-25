import { DomainError } from '../../shared/domain/domain-error';

import { Character } from './character.vo';

export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  characters: Character[];
  isAdmin: boolean;
}

export function addCharacter(account: Account, character: Character) {
  return {
    ...account,
    characters: [...account.characters, character],
  };
}

export function checkIfCanCreateNormalCharacterFor(
  origin: Account,
  receiver: Account
) {
  if (origin.id !== receiver.id && !origin.isAdmin) {
    throw new DomainError('only admin can create characters in other accounts');
  }
}
export function checkIfCanCreateGodCharacterFor(origin: Account) {
  if (!origin.isAdmin) {
    throw new DomainError('only admin can create god characters');
  }
}
