import {
  CharacterList,
  create as createCharacterList,
  addCharacter as addCharacterToList,
  removeCharacter as removeCharacterFromList,
} from './characters/character-list.model';
import {
  UserData,
  create as createUserData,
  changeEmail as changeEmailInData,
} from './user-data/user-data.model';
import {
  PasswordAuthentication,
  create as createPasswordAuthentication,
  changePassword as changePasswordInAuth,
  logInWithToken,
} from './authorization/password-authentication.model';
import { PasswordEncryptionService } from './authorization/password-encryption.service';
import { TokenizerService } from './authorization/tokenizer.service';

export type User = {
  id: string;
  userData: UserData;
  characterList: CharacterList;
  passwordAuthentication?: PasswordAuthentication;
};

export async function createWithPasswordAuthentication(
  id: string,
  email: string,
  password: string,
  passwordEncryptionService: PasswordEncryptionService
): Promise<User> {
  const userData = createUserData(email);
  const characterList = createCharacterList();
  const passwordAuthentication = await createPasswordAuthentication(
    password,
    passwordEncryptionService
  );

  return {
    id,
    userData,
    characterList,
    passwordAuthentication,
  };
}

export function changeEmail(user: User, email: string) {
  return {
    ...user,
    userData: changeEmailInData(user.userData, email),
  };
}

export function addCharacter(user: User, character: string) {
  return {
    ...user,
    characterList: addCharacterToList(user.characterList, character),
  };
}

export function removeCharacter(user: User, character: string) {
  return {
    ...user,
    characterList: removeCharacterFromList(user.characterList, character),
  };
}

export function changePassword(
  user: User,
  newPassword: string,
  passwordEncryptionService: PasswordEncryptionService
) {
  if (user.passwordAuthentication) {
    return {
      ...user,
      passwordAuthentication: changePasswordInAuth(
        user.passwordAuthentication,
        passwordEncryptionService,
        newPassword
      ),
    };
  }

  throw 'there is no password authentication for that user';
}

export async function loginByPasswordWithToken(
  user: User,
  password: string,
  passwordEncryptionService: PasswordEncryptionService,
  tokenizerService: TokenizerService
) {
  if (user.passwordAuthentication) {
    return logInWithToken(
      user.id,
      user.passwordAuthentication,
      passwordEncryptionService,
      password,
      tokenizerService
    );
  }

  throw 'there is no password authentication for that user';
}
