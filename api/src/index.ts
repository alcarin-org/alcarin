import 'reflect-metadata';

import { initializeDIAfterDBLoad } from '@/server/services/di-ready-components';
import { validateEnvVars, envVars } from '@/server/core/env-vars';
import { setupExpressApp } from '@/server/core/setup-express-app';
import { logger } from '@/server/core/helpers/logger';
import { createDatabaseConnection } from '@/server/db';

async function main() {
  try {
    validateEnvVars();

    await createDatabaseConnection();

    const app = await setupExpressApp();

    initializeDIAfterDBLoad();

    app.listen(envVars.PORT, () => {
      logger.info('Express server started on port: ' + envVars.PORT);
    });
  } catch (err) {
    logger.error(err);
  }
}

main();
