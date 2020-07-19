export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  characters: {
    id: string;
  }[];
}

export function addCharacter(account: Account, character: { id: string }) {
  return {
    ...account,
    characters: [...account.characters, character],
  };
}
