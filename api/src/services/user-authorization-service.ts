import { UserRepository } from '../modules/users/user.repository';
import {
  createWithPasswordAuthentication,
  loginByPasswordWithToken,
} from '../modules/users/user.aggregate';
import { PasswordEncryptionService } from '../modules/users/authorization/password-encryption.service';
import { TokenizerService } from '../modules/users/authorization/tokenizer.service';

function uuidGenerator() {
  return '4';
}

export default (userRepository: UserRepository) => {
  async function registerUserWithPasswordAuthorization(
    email: string,
    password: string,
    passwordEncryptionService: PasswordEncryptionService
  ) {
    const userId = uuidGenerator();
    const aggregate = await createWithPasswordAuthentication(
      userId,
      email,
      password,
      passwordEncryptionService
    );

    return userRepository.save(aggregate);
  }

  async function logInWithPassword(
    email: string,
    password: string,
    passwordEncryptionService: PasswordEncryptionService,
    tokenizerService: TokenizerService
  ) {
    const user = await userRepository.getByEmail(email);
    return await loginByPasswordWithToken(
      user,
      password,
      passwordEncryptionService,
      tokenizerService
    );
  }

  return { registerUserWithPasswordAuthorization, logInWithPassword };
};
