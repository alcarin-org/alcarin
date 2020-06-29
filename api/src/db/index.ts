import { Connection, createConnection, ConnectionOptions } from 'typeorm';

import ormconfig from '../../ormconfig';

import {
  UserRepository,
  UniversePropertyRepository,
  CharacterRepository,
} from './repository';

type ReposType = {
  UserRepo: UserRepository;
  UniversePropertyRepo: UniversePropertyRepository;
  CharactersRepo: CharacterRepository;
};

export let connection: Connection;
export let UserRepo: UserRepository;
export let UniversePropertyRepo: UniversePropertyRepository;
export let CharactersRepo: CharacterRepository;
export let Repos: ReposType;

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

  Repos = { CharactersRepo, UserRepo, UniversePropertyRepo };

  return connection;
}
