import { getRepository } from 'typeorm';

import {
  UsersUser,
  UsersCharacter,
  UsersUserData,
  UsersPasswordAuthentication,
} from '../../db/entities';
import { UserRepository } from '../../modules/users/user.repository';
import { User } from '../../modules/users/user.aggregate';
import { CharacterList } from '../../modules/users/characters/character-list.model';
import { UserData } from '../../modules/users/user-data/user-data.model';
import {
  PasswordAuthentication,
  simplyCreate as createPasswordAuthentication,
} from '../../modules/users/authorization/password-authentication.model';

const userRepository = getRepository(UsersUser);
const userDataRepository = getRepository(UsersUserData);

export class EntityUserRepository implements UserRepository {
  async getByEmail(email: string): Promise<User> {
    const userData = await userDataRepository.findOne(
      { email },
      { relations: ['user'] }
    );
    if (!userData) {
      throw 'user not found';
    }

    return this.getById(userData.user.id);
  }

  async getById(id: string): Promise<User> {
    const relations = ['characters', 'passwordAuthentication', 'userData'];
    const user = await userRepository.findOne({ id }, { relations });
    if (!user) {
      throw 'user not found';
    }

    return mapUserToModel(user);
  }

  async save(user: User): Promise<void> {
    const userEntity = new UsersUser();

    userEntity.id = user.id;

    userEntity.userData = new UsersUserData();
    userEntity.userData.email = user.userData.email;

    if (user.passwordAuthentication?.password) {
      userEntity.passwordAuthentication = new UsersPasswordAuthentication();
      userEntity.passwordAuthentication.password =
        user.passwordAuthentication.password;
    }

    userEntity.characters = user.characterList.characters.map(el => {
      const characterEntity = new UsersCharacter();
      characterEntity.id = el;
      return characterEntity;
    });

    await userRepository.save(userEntity);
  }
}

function mapUserToModel(user: UsersUser): User {
  const userData = mapUserDataToModel(user.userData);
  const characterList = mapCharactersToModel(user.characters || []);
  const passwordAuthentication = mapPasswordAuthenticationToModel(
    user.passwordAuthentication
  );

  return {
    id: user.id,
    userData,
    characterList,
    passwordAuthentication,
  };
}

function mapUserDataToModel(userData: UsersUserData): UserData {
  return {
    email: userData.email,
  };
}
function mapCharactersToModel(characters: UsersCharacter[]): CharacterList {
  return {
    characters: characters.map(el => el.id),
  };
}
function mapPasswordAuthenticationToModel(
  auth?: UsersPasswordAuthentication
): PasswordAuthentication | undefined {
  if (!auth) return undefined;
  return createPasswordAuthentication({
    password: auth.password,
  });
}
