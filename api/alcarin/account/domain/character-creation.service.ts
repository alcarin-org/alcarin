import { Race } from '../../shared/domain/race.vo';

import { Characters } from './characters.module';
import {
  checkIfCanCreateNormalCharacterFor,
  checkIfCanCreateGodCharacterFor,
  Account,
  addCharacter,
} from './account.aggregate';

export async function createNormalCharacterInAccount(
  characters: Characters,
  creator: Account,
  receiver: Account,
  name: string,
  race: Race
) {
  checkIfCanCreateNormalCharacterFor(creator, receiver);

  const character = await characters.createNormalCharacter(name, race);
  return addCharacter(receiver, character);
}

export async function createGodCharacterInAccount(
  characters: Characters,
  creator: Account,
  receiver: Account,
  name: string,
  race: Race
) {
  checkIfCanCreateGodCharacterFor(creator);

  const character = await characters.createGodCharacter(name, race);
  return addCharacter(receiver, character);
}
