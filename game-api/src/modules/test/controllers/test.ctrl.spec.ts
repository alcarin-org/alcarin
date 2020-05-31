import status from 'http-status-codes';
import testApi from '@spec/api';

import { validateRes } from '../../../shared/server/openapi';

describe('Test controller', () => {
  it('should return 200 if shared mailbox does not exists, but do not queue message', async () => {
    const res = await testApi()
      .get(`/test/test`)
      .send()
      .expect(status.OK);

    validateRes('get', '/test/test')(res);
    res.body.should.deep.equal({
      message: 'all is fine',
    });
  });
});
