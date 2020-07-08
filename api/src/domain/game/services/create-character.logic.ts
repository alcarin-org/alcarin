import { CharacterRepository } from 'src/domain/game/character/character.repository';
import { StartingAge } from 'src/domain/game/character/character';

export type createCharacterDI<TRaceKey> = {
  characterRepository: CharacterRepository<TRaceKey>;

};

export async function createCharacter<TRaceKey>(
  di: createCharacterDI<TRaceKey>,
  name: string,
  race: TRaceKey,
) {
  const { characterRepository } = di;
  return await characterRepository.createAndSave({ name, age: StartingAge, race });
}
