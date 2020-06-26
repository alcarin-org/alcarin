import assert from "assert";
import status from 'http-status-codes';

import testApi from '../../../shared/spec/api';
import { createTestUserAndLogin } from '../../../shared/spec/db';
import { connection } from '../../../db';
import { Character } from '../../../db/entities/character';

describe('Character controller', () => {
  describe('create new character test', () => {
    it('should create character with logged in user', async () => {
      const token = await createTestUserAndLogin();

      const res = await testApi(token)
        .post('/characters/create')
        .send({
          name: 'Some name',
          race: 'elf',
        })
        .expect(status.OK);

      const character = await connection.manager.findOne(Character, {
        id: res.body.id,
      });

      assert.notStrictEqual(character, undefined);
    });
  });
});
