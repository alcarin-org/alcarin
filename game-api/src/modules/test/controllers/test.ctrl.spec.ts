import status from 'http-status-codes';
import sinon from 'sinon';
import { createMailbox, inviteMailboxUser } from '@spec/db';
import testApi from '@spec/api';

import { InvitationStatus } from '../../../../db/entities/shared-mailbox-user';
import { MainQueue } from '../../../../queue';
import { envVars } from '../../../../shared/envVars';

describe('PubSub callback endpoint', () => {
  const sharedMailboxEmail = 'support@codequest.com';
  const userEmail = 'user@codequest.com';

  beforeEach(async () => {
    await createMailbox(sharedMailboxEmail);
    await inviteMailboxUser(sharedMailboxEmail, userEmail, {
      invitationStatus: InvitationStatus.Accepted,
    });
    sinon.stub(MainQueue, 'queueMailboxSync');
  });

  it('should return 200 if shared mailbox does not exists, but do not queue message', async () => {
    const wrongEmail = 'not-exists@codequest.com';
    const message = encodeMessage({
      emailAddress: wrongEmail,
      historyId: 108710,
    });

    await testApi(envVars.PUB_SUB_SERVICE_ACCOUNT_EMAIL)
      .post(`/pubsub/callback`)
      .send({ message, subscription: envVars.PUB_SUB_SUBSCRIPTION })
      .expect(status.OK);

    MainQueue.queueMailboxSync.should.not.have.been.called;
  });

  it('should return 200 if it is wrong subscription, but do not queue message', async () => {
    const message = encodeMessage({
      emailAddress: sharedMailboxEmail,
      historyId: 108710,
    });

    await testApi(envVars.PUB_SUB_SERVICE_ACCOUNT_EMAIL)
      .post(`/pubsub/callback`)
      .send({ message, subscription: 'random-sub' })
      .expect(status.OK);

    MainQueue.queueMailboxSync.should.not.have.been.called;
  });

  it('should return 401 if pubsub auth fails', async () => {
    const message = encodeMessage({
      emailAddress: sharedMailboxEmail,
      historyId: 108710,
    });

    await testApi('wrong@email.test')
      .post(`/pubsub/callback`)
      .send({ message, subscription: envVars.PUB_SUB_SUBSCRIPTION })
      .expect(status.UNAUTHORIZED);

    MainQueue.queueMailboxSync.should.not.have.been.called;
  });

  it('should queue message when all is ok', async () => {
    const message = encodeMessage({
      emailAddress: sharedMailboxEmail,
      historyId: 108710,
    });

    await testApi(envVars.PUB_SUB_SERVICE_ACCOUNT_EMAIL)
      .post(`/pubsub/callback`)
      .send({ message, subscription: envVars.PUB_SUB_SUBSCRIPTION })
      .expect(status.OK);

    MainQueue.queueMailboxSync.should.have.been.called;
  });

  function encodeMessage<T>(obj: T) {
    const buff = Buffer.from(JSON.stringify(obj), 'ascii');
    return {
      data: buff.toString('base64'),
      /* eslint-disable-next-line @typescript-eslint/camelcase */
      message_id: '',
    };
  }
});
