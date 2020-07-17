import { CharacterRepository } from './character/character.repository';
import { StartingAge } from './character/character';
import { AvailableRace } from './character/race';

type CreateCharacterDI = {
  characterRepository: CharacterRepository;
};

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
