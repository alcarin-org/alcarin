import { AvailableRace, CharacterRaceBehaviour } from './race';
import { CharacterRepository } from './character.repository';

export const StartingAge = 20;

export interface Character {
  id: string;
  name: string;
  age: number;
  raceKey: AvailableRace;
}

export type CharacterBehaviour<TRaceKey> = CharacterRaceBehaviour<TRaceKey>;

type CreateCharacterDI = { characterRepository: CharacterRepository };

export async function createCharacter(
  di: CreateCharacterDI,
  name: string,
  race: AvailableRace
) {
  const { characterRepository } = di;
  return await characterRepository.createAndSave({
    name,
    age: StartingAge,
    race,
  });
}
