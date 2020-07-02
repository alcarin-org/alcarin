import { UserRepository } from '../modules/users/user.repository';
import { addCharacter } from '../modules/users/user.aggregate';
import { CharacterRepository } from '../modules/characters/character.repository';
import { create as createCharacter } from '../modules/characters/character.aggregate';
import { RaceProvider } from '../modules/characters/race/race-provider';

function uuidGenerator() {
  return '4';
}

export default (
  userRepository: UserRepository,
  characterRepository: CharacterRepository,
  raceProvider: RaceProvider
) => {
  async function createCharacterForUser(
    userId: string,
    name: string,
    raceKey: string,
    age = 20
  ) {
    const characterId = uuidGenerator();
    const raceBehaviour = raceProvider.provideRaceBehaviour(raceKey);
    const character = createCharacter(
      characterId,
      name,
      age,
      raceKey,
      raceBehaviour
    );

    await characterRepository.save(character);

    let user = await userRepository.getById(userId);
    user = addCharacter(user, characterId);
    await userRepository.save(user);
  }

  return { createCharacterForUser };
};
