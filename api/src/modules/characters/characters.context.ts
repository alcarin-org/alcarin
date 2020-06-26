import { CharactersRepo } from '../../db';
import { Race } from "./race";


export async function createNewCharacter(
  owner: string,
  name: string,
  race: Race
) {
  const character = await CharactersRepo.create(owner, name, race.key);
  return character;
}
