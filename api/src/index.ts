import 'reflect-metadata';

import { createDatabaseConnection } from 'src/server/db';
import { logger } from 'src/server/core/helpers/logger';
import { setupExpressApp } from 'src/server/core/setup-express-app';
import { validateEnvVars, envVars } from 'src/server/core/env-vars';

async function main() {
  try {
    validateEnvVars();

    await createDatabaseConnection();

    const app = await setupExpressApp();

    app.listen(envVars.PORT, () => {
      logger.info('Express server started on port: ' + envVars.PORT);
    });
  } catch (err) {
    logger.error(err);
  }
}

main();
