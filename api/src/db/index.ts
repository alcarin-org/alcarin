import { Connection, createConnection, ConnectionOptions } from 'typeorm';

import ormconfig from '../../ormconfig';

import { UserRepository } from './repository/user-repository';
import { UniversePropertyRepository } from './repository/universe-property-repository';
import { CharacterRepository } from './repository/character-repository';

export let connection: Connection;

export let UserRepo: UserRepository;
export let UniversePropertyRepo: UniversePropertyRepository;
export let CharactersRepo: CharacterRepository;
type ReposType = Array<
  UserRepository | UniversePropertyRepository | CharacterRepository
>;
export let Repos: ReposType = [];

export async function createDatabaseConnection(
  options?: Partial<ConnectionOptions>
) {
  connection = await createConnection({
    ...ormconfig,
    ...options,
  } as ConnectionOptions);

  CharactersRepo = connection.getCustomRepository(CharacterRepository);
  UserRepo = connection.getCustomRepository(UserRepository);
  UniversePropertyRepo = connection.getCustomRepository(
    UniversePropertyRepository
  );

  Repos = [CharactersRepo, UserRepo, UniversePropertyRepo];

  return connection;
}
