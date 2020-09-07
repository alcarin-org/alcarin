import { ConnectionOptions } from 'typeorm';
import { envVars } from 'src/server/env-vars';

import { SnakeCaseNamingStrategy } from './snake-case-naming-strategy';
import { DbLogger } from './db-logger';

const registeredTypeormModules = ['account', 'game/characters'];

function getEntitiesPaths() {
  return registeredTypeormModules.map(module => {
    return `${__dirname}/../../alcarin/${module}/infrastructure/typeorm/entities/*.ts`;
  });
}

function getMigrationsPaths() {
  return registeredTypeormModules.map(module => {
    return `${__dirname}/../../alcarin/${module}/infrastructure/typeorm/migrations/*.ts`;
  });
}

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  database: envVars.DB_DATABASE,
  username: envVars.DB_USERNAME,
  password: envVars.DB_PASSWORD,
  host: envVars.DB_HOST,
  entities: getEntitiesPaths(),
  migrations: getMigrationsPaths(),
  logging: envVars.DB_LOGGING,
  logger: envVars.DB_LOGGING ? new DbLogger() : undefined,
  cli: {
    entitiesDir: 'src/cli/entities',
    migrationsDir: 'src/cli/migrations',
  },
  namingStrategy: new SnakeCaseNamingStrategy(),
  synchronize: true,
  migrationsRun: false,
};

module.exports = ormconfig;

export default ormconfig;
