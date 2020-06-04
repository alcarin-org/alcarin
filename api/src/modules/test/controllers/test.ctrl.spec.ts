import status from 'http-status-codes';

import testApi from '../../../shared/spec/api';

describe('Test controller', () => {
  it('should return 200', async () => {
    const res = await testApi()
      .get(`/test/test`)
      .send()
      .expect(status.OK);

    res.body.should.deep.equal({
      message: 'all is fine',
    });
  });
});
