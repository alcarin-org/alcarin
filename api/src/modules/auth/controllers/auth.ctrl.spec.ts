import status from 'http-status-codes';
import { decode } from 'jsonwebtoken';

import testApi from '../../../shared/spec/api';
import { registerUser } from '../../../shared/spec/db';
import { envVars } from '../../../shared/env-vars';
import { connection } from '../../../db';
import { User } from '../../../db/entities/user';

describe('Auth controller', () => {
  const testEmail = 'test@test.com';
  const testPassword = 'test123';

  describe('sign up', () => {
    it('should return 204 and register the user', async () => {
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

      const users = await connection.manager.find(User);
      users.length.should.equal(1);
    });
  });

  describe('log in', () => {
    it('should log in user and provide authorization token', async () => {
      await registerUser(testEmail, testPassword);
      const res = await testApi()
        .post('/session')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(status.OK);

      res.body.tokenType.should.equal('Bearer');
      const decodedToken = decode(res.body.accessToken) as Record<string, any>;

      const users = await connection.manager.find(User, { email: testEmail });
      users.length.should.equal(1);

      decodedToken['client_id'].should.equal(users[0].id);
      decodedToken.aud.should.equal(envVars.URL_BASE);
    });

    it('should refuse to log in to not existing user account', async () => {
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
