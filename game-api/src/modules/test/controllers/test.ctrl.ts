import { AppRequestHandler } from 'express';
import status from 'http-status-codes';

import { logger } from '../../../shared/logger';

export type ProcessPubSubMessageRequest = {
  body: {
    message: {
      data: string;
      message_id: string;
    };
  };
};

export const test: AppRequestHandler<ProcessPubSubMessageRequest> = async (
  req,
  res
) => {
  logger.info('example request done');
  return res.status(status.OK).send({ message: 'all is fine' });
};
