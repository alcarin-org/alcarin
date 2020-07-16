import { CharacterRepository } from './character/character.repository';
import { StartingAge } from './character/character';

export type createCharacterDI<TRaceKey> = {
  characterRepository: CharacterRepository<TRaceKey>;
};

export async function createCharacter<TRaceKey>(
  di: createCharacterDI<TRaceKey>,
  name: string,
  race: TRaceKey
) {
  const { characterRepository } = di;
  return await characterRepository.createAndSave({
    name,
    age: StartingAge,
    race,
  });
}
