import { PasswordEncryptor } from '@/domain/access/tools/password-encryptor.tool';
import { createGenericCollectionBehaviour } from '@/domain/shared/generic-collection';

export type Account = {
  id: string;
  email: string;
  passwordHash: string;
  characters: string[];
};

const genericCollectionBehaviour = createGenericCollectionBehaviour<string>();

export function canLogin(
  account: Account,
  passwordCandidate: string,
  encryptor: PasswordEncryptor
): Promise<boolean> {
  return encryptor.isPasswordMatch(account.passwordHash, passwordCandidate);
}

export function addCharacter(account: Account, character: string) {
  return {
    ...account,
    characters: genericCollectionBehaviour.addItem(
      account.characters,
      character
    ),
  };
}
export function removeCharacter(account: Account, character: string) {
  return {
    ...account,
    characters: genericCollectionBehaviour.removeItem(
      account.characters,
      character
    ),
  };
}
