import assert from 'assert';

import status from 'http-status-codes';

import testApi from './api';

export function createPostTestForGuardAgainstUnlogin(
  url: string,
  payload: string | object
) {
  return async () => {
    const resp = await testApi('anyInvalidToken')
      .post(url)
      .send(payload);

    assert.strictEqual(resp.status, status.UNAUTHORIZED);
  };
}

export function createGetTestForGuardAgainstUnlogin(url: string) {
  return async () => {
    const resp = await testApi('anyInvalidToken').get(url);

    assert.strictEqual(resp.status, status.UNAUTHORIZED);
  };
}
