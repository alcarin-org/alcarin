import supertest from 'supertest';
import { Express } from 'express';
import { setupExpressApp } from 'src/server/core/setup-express-app';
import { TokenType } from 'src/server/rest/controllers/auth.ctrl';
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
      `${TokenType} ${token}`
    );
  }

  return agent;
}

export default testApi;
