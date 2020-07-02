import { AuthenticationStrategy, TokenizerService} from './tokenizer.service';
import { PasswordEncryptionService } from './password-encryption.service';
import { InvalidAuth } from './error/InvalidAuth';

export type PasswordAuthentication = {
  password: string;
  strategy: AuthenticationStrategy.PASSWORD;
};

export function simplyCreate(
  data: Omit<PasswordAuthentication, 'strategy'>
): PasswordAuthentication {
  return {
    ...data,
    strategy: AuthenticationStrategy.PASSWORD,
  };
}

export async function create(
  rawPassword: string,
  passwordEncryptionService: PasswordEncryptionService
): Promise<PasswordAuthentication> {
  const hashedPassword = await passwordEncryptionService.hashPassword(
    rawPassword
  );
  return {
    password: hashedPassword,
    strategy: AuthenticationStrategy.PASSWORD,
  };
}

export async function isPasswordMatch(
  auth: PasswordAuthentication,
  passwordEncryptionService: PasswordEncryptionService,
  password: string
) {
  return passwordEncryptionService.isPasswordMatch(auth.password, password);
}

export async function changePassword(
  auth: PasswordAuthentication,
  passwordEncryptionService: PasswordEncryptionService,
  rawPassword: string
) {
  const password = passwordEncryptionService.hashPassword(rawPassword);
  return {
    ...auth,
    password,
  };
}

export async function logInWithToken(
  user: string,
  auth: PasswordAuthentication,
  passwordEncryptionService: PasswordEncryptionService,
  password: string,
  tokenizerService: TokenizerService
) {
  const canLogIn = await isPasswordMatch(
    auth,
    passwordEncryptionService,
    password
  );

  if (!canLogIn) {
    throw new InvalidAuth();
  }
  return tokenizerService.createToken({
    userId: user,
    strategy: auth.strategy
  });
}
