import 'reflect-metadata';

import { createDatabaseConnection } from './db';
import { logger } from './shared/logger';
import { setupExpressApp } from './shared/server/setup-express-app';
import { /*validateEnvVars,*/ envVars } from './shared/envVars';

async function main() {
  try {
    // validateEnvVars();

    await createDatabaseConnection();

    const app = setupExpressApp();

    app.listen(envVars.PORT, () => {
      logger.info('Express server started on port: ' + envVars.PORT);
    });
  } catch (err) {
    logger.error(err);
  }
}

main();
