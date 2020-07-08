import status from 'http-status-codes';
import { decode } from 'jsonwebtoken';

import testApi from 'src/spec/api';
import { registerAccount } from 'src/spec/db';
import { envVars } from 'src/server/core/env-vars';
import { connection } from 'src/server/db';
import { Account } from 'src/server/db/entities/access/account';

describe('Auth controller', () => {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  describe('sign up', () => {
    it('should return 204 and register the account', async () => {
      await testApi()
        .post('/accounts')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.NO_CONTENT);
    });

    it('should quietly refuse registration for already registered email address', async () => {
      await testApi()
        .post('/accounts')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.NO_CONTENT);

      await testApi()
        .post('/accounts')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.NO_CONTENT);

      const accounts = await connection.manager.find(Account);
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

      res.body.tokenType.should.equal('bearer');
      const decodedToken = decode(res.body.accessToken) as Record<string, any>;

      const accounts = await connection.manager.find(Account, { email: testEmail });
      accounts.length.should.equal(1);

      decodedToken['client_id'].should.equal(accounts[0].id);
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
