import { ConnectionOptions } from 'typeorm';
import { SnakeCaseNamingStrategy } from '@/server/db/snake-case-naming-strategy';
import { DbLogger } from '@/server/db/db-logger';
import { envVars } from '@/server/core/env-vars';

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  database: envVars.DB_DATABASE,
  username: envVars.DB_USERNAME,
  password: envVars.DB_PASSWORD,
  host: envVars.DB_HOST,
  entities: [`${__dirname}/src/server/db/entities/**/*.ts`],
  migrations: [`${__dirname}/src/server/db/migrations/*.ts`],
  logging: envVars.DB_LOGGING,
  logger: envVars.DB_LOGGING ? new DbLogger() : undefined,
  cli: {
    entitiesDir: 'src/server/db/entities',
    migrationsDir: 'src/server/db/migrations',
  },
  namingStrategy: new SnakeCaseNamingStrategy(),
  synchronize: true,
  migrationsRun: false,
};

module.exports = ormconfig;

export default ormconfig;
