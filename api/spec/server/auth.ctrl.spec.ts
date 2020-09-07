import status from 'http-status-codes';
import { decode } from 'jsonwebtoken';
import testApi from '../api';
import { registerAccount } from '../db';
import { envVars } from '../../src/server/env-vars';
import { getDefaultConnection } from '../../src/db';
import { Account } from '@/../../../../alcarin/shared/infrastructure/typeorm/entities/account';

describe('Auth controller', () => {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  describe('sign up', () => {
    it('should return 204 and register the account', async () => {
      await testApi()
        .post('/users')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.NO_CONTENT);
    });

    it('should quietly refuse registration for already registered email address', async () => {
      await testApi()
        .post('/users')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.NO_CONTENT);

      await testApi()
        .post('/users')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.NO_CONTENT);

      const accounts = await getDefaultConnection()!.manager.find(Account);
      accounts.length.should.equal(1);
    });
  });

  describe('log in', () => {
    it('should log in account and provide authorization token', async () => {
      await registerAccount(testEmail, testPassword);
      const res = await testApi()
        .post('/session')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.OK);
      res.body.tokenType.should.equal('Bearer');
      const decodedToken = decode(res.body.accessToken) as Record<string, any>;

      const accounts = await getDefaultConnection()!.manager.find(Account, {
        email: testEmail,
      });

      accounts.length.should.equal(1);

      decodedToken['accountId'].should.equal(accounts[0].id);
      decodedToken.aud.should.equal(envVars.URL_BASE);
    });

    it('should refuse to log in to not existing account', async () => {
      await testApi()
        .post('/session')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.UNAUTHORIZED);
    });
  });
});
