import 'reflect-metadata';

import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { Connection, getConnection } from 'typeorm';
import { createDatabaseConnection } from '@/server/db';
import { MainScheduler, redis as queueRedis } from '@/server/queue';
import { redis } from '@/server/queue/redis';
import { envVars } from '@/server/core/env-vars';

chai.use(sinonChai);
chai.should();

before(async () => {
  await createTestDatabase();
  await createDatabaseConnection({
    migrationsRun: true,
  });
});

beforeEach(async () => {
  await clearRedis();
});

afterEach(async () => {
  const connection = getConnection('default');

  if (connection) {
    await cleanupTables(connection);
  }
  sinon.restore();
});

after(async () => {
  const connection = getConnection('default');

  if (connection) {
    await connection.close();
  }
  await clearRedis();
  redis.disconnect();
  queueRedis.disconnect();
  MainScheduler.close();
});

async function cleanupTables(connection: Connection) {
  const tables = await connection.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    AND table_type='BASE TABLE'
  `);
  const tableNames = tables
    .map((t: { table_name: string }) => t.table_name)
    .join(', ');
  return connection.query(`TRUNCATE TABLE ${tableNames} CASCADE`);
}

async function createTestDatabase() {
  const localConnection = await createDatabaseConnection({
    // we use default database, as we can not drop database that
    // have open connections
    database: 'postgres',
    migrationsRun: false,
  });

  await localConnection.query(
    `DROP DATABASE IF EXISTS "${envVars.DB_DATABASE}"`
  );
  await localConnection.query(`CREATE DATABASE "${envVars.DB_DATABASE}"`);
  await localConnection.close();
}

async function clearRedis() {
  return redis.flushdb();
}
