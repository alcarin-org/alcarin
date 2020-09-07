import supertest from 'supertest';
import { Express } from 'express';
import { setupExpressApp } from '@/../../alcarin/server/core/setup-express-app';
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
      `Bearer ${token}`
    );
  }

  return agent;
}

export default testApi;
