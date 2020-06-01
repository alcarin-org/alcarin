import supertest from 'supertest';
import { Express } from 'express';

import { setupExpressApp } from '../server/setup-express-app';

let app: Express;

before(async () => {
  app = await setupExpressApp();
});

function testApi(email?: string) {
  const agent = supertest.agent(app);
  if (email) {
    // supertest agent type definition do not support `set` method, but the agent has it
    (agent as typeof agent & { set: (h: string, v: string) => void }).set(
      'Authorization',
      `Bearer ${email}`
    );
  }

  return agent;
}

export default testApi;
