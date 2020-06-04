import 'reflect-metadata';

import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { Connection, getConnection } from 'typeorm';

import { createDatabaseConnection } from './db';
import { MainScheduler, redis as queueRedis } from './queue';
import { redis } from './queue/redis';

chai.use(sinonChai);
chai.should();

const TestDatabase = 'testdb';

before(async () => {
  await createTestDatabase();
  await createDatabaseConnection({
    database: TestDatabase,
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
    database: '',
    migrationsRun: false,
  });

  await localConnection.query(
    `DROP DATABASE IF EXISTS "${TestDatabase}"`
  );
  await localConnection.query(`CREATE DATABASE "${TestDatabase}"`);
  await localConnection.close();
}

async function clearRedis() {
  return redis.flushdb();
}
