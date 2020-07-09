import assert from 'assert';

import status from 'http-status-codes';
import testApi from 'src/spec/api';
import { createTestAccountAndLogin } from 'src/spec/db';
import {
  createPostTestForGuardAgainstUnlogin,
  createGetTestForGuardAgainstUnlogin,
} from 'src/spec/security';

type createCharReqType = {
  name: string;
  race: string;
};

function createCharacter(
  token: string,
  creationPayload: createCharReqType = {
    name: 'Some name',
    race: 'elf',
  }
) {
  return testApi(token)
    .post('/users/current/characters')
    .send(creationPayload);
}

describe('Character controller', () => {
  describe('create new character', () => {
    it('should not create character with not logged in user', async () => {
      const createCharReq = {
        name: 'Some name',
        race: 'elf',
      };

      await createPostTestForGuardAgainstUnlogin(
        '/users/current/characters',
        createCharReq
      )();
    });

    it('should create character with logged in user', async () => {
      const token = await createTestAccountAndLogin();

      const createCharReq: createCharReqType = {
        name: 'Some name',
        race: 'elf',
      };

      const { body } = await createCharacter(token, createCharReq).expect(
        status.CREATED
      );

      assert.strictEqual(body.name, createCharReq.name);
      assert.strictEqual(body.race, createCharReq.race);
    });
  });

  describe('find all for user', () => {
    it('should not find all with not logged in user', async () => {
      const token = await createTestAccountAndLogin();
      await createCharacter(token);
      await createGetTestForGuardAgainstUnlogin(`/users/current/characters`)();
    });

    it('return proper amount of character created', async () => {
      const token = await createTestAccountAndLogin();
      await createCharacter(token);
      await createCharacter(token);

      const res = await testApi(token)
        .get(`/users/current/characters`)
        .expect(status.OK);

      assert.deepStrictEqual(res.body.length, 2);
    });
  });
});
