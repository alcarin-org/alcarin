import 'reflect-metadata';

import { validateEnvVars, envVars } from './server/env-vars';
import { setupExpressApp } from './server/setup-express-app';
import { logger } from './helpers/logger';
import { createDatabaseConnection } from './db';
import { initializeModules } from './module-storage';

async function main() {
  try {
    validateEnvVars();

    await createDatabaseConnection();

    await initializeModules();

    const app = await setupExpressApp();

    app.listen(envVars.PORT, () => {
      logger.info('Express server started on port: ' + envVars.PORT);
    });
  } catch (err) {
    logger.error(err);
  }
}

main();
