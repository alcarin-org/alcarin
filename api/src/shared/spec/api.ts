import supertest from 'supertest';
import { Express } from 'express';

import { setupExpressApp } from '../server/setup-express-app';
import { TOKEN_TYPE } from '../../modules/auth/controllers/auth.ctrl';

let app: Express;

before(async () => {
  app = await setupExpressApp();
});

function testApi(token?: string) {
  const agent = supertest.agent(app);
  if (token) {
    // supertest agent type definition do not support `set` method, but the agent has it
    (agent as typeof agent & { set: (h: string, v: string) => void }).set(
      'Authorization',
      `${TOKEN_TYPE} ${token}`
    );
  }

  return agent;
}

export default testApi;
