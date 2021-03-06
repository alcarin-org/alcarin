import { ConnectionOptions } from 'typeorm';

import { SnakeCaseNamingStrategy } from './src/db/snake-case-naming-strategy';
import { DbLogger } from './src/db/db-logger';

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  entities: [`${__dirname}/src/db/entities/*.ts`],
  migrations: [`${__dirname}/src/db/migrations/*.ts`],
  logging: process.env.DB_LOGGING === '1',
  logger: process.env.DB_LOGGING === '1' ? new DbLogger() : undefined,
  cli: {
    entitiesDir: 'src/db/entities',
    migrationsDir: 'src/db/migrations',
  },
  namingStrategy: new SnakeCaseNamingStrategy(),
  synchronize: true,
  migrationsRun: false,
};

module.exports = ormconfig;

export default ormconfig;
