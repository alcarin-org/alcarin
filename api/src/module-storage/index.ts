import { AccountModuleApi } from 'alcarin/account';
import { CharactersModuleApi } from 'alcarin/game/characters';
import { AccountsModuleFactory } from 'alcarin/account/infrastructure/accounts-module-factory';
import { CharactersModuleFactory } from 'alcarin/game/characters/infrastructure/characters-module-factory';
import { envVars } from 'src/server/env-vars';

export let accountModule: AccountModuleApi;
export let charactersModule: CharactersModuleApi;

export async function initializeModules() {
  accountModule = createAccountModule();
  charactersModule = createCharactersModule();
}

function createAccountModule() {
  return AccountsModuleFactory(
    envVars.AUTH_KEY,
    envVars.URL_BASE,
    envVars.AUTH_EXPIRATION_SEC,
    envVars.BCRYPT_ROUNDS
  );
}

function createCharactersModule() {
  return CharactersModuleFactory();
}
