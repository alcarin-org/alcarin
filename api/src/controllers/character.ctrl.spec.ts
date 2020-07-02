import assert from 'assert';

import status from 'http-status-codes';

import testApi from '../shared/spec/api';
import { createTestUserAndLogin } from '../shared/spec/db';
import {
  createPostTestForGuardAgainstUnlogin,
  createGetTestForGuardAgainstUnlogin,
} from '../shared/spec/security';

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
      );
    });
    it('should create character with logged in user', async () => {
      const token = await createTestUserAndLogin();

      const createCharReq: createCharReqType = {
        name: 'Some name',
        race: 'elf',
      };

      const { body } = await createCharacter(token, createCharReq).expect(
        status.CREATED
      );

      assert.strictEqual(body.name, createCharReq.name);
      assert.strictEqual(body.race.key, createCharReq.race);
    });
  });
  describe('find one', () => {
    it('should not find one with not logged in user', async () => {
      const token = await createTestUserAndLogin();
      const resCreation = await createCharacter(token);

      await createGetTestForGuardAgainstUnlogin(
        `/users/current/characters/${resCreation.body.id}`
      );
    });
    it('created and found character should be same', async () => {
      const token = await createTestUserAndLogin();
      const resCreation = await createCharacter(token);

      const oneCharacterResponse = await testApi(token)
        .get(`/users/current/characters/${resCreation.body.id}`)
        .expect(status.OK);

      assert.deepStrictEqual(resCreation.body, oneCharacterResponse.body);
    });

    it('it send internal error on bad character id format', async () => {
      const token = await createTestUserAndLogin();

      await testApi(token)
        .get(`/users/current/characters/ANY_NON_EX_ID`)
        .expect(status.INTERNAL_SERVER_ERROR);
    });

    it('it send bad request on non exisitng character bad id', async () => {
      const token = await createTestUserAndLogin();

      await testApi(token)
        .get(`/users/current/characters/00000000-0000-0000-0000-000000000000`)
        .expect(status.BAD_REQUEST);
    });
  });

  describe('find all for user', () => {
    it('should not find all with not logged in user', async () => {
      const token = await createTestUserAndLogin();
      await createCharacter(token);
      await createGetTestForGuardAgainstUnlogin(`/users/current/characters`);
    });

    it('return proper amount of character created', async () => {
      const token = await createTestUserAndLogin();

      await createCharacter(token);
      await createCharacter(token);

      const all = await testApi(token)
        .get(`/users/current/characters`)
        .expect(status.OK);

      assert.deepStrictEqual(all.body.length, 2);
    });
  });
});
