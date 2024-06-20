import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container, initializeContainer } from './infrastructure/di/container';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import './presentation/controllers/HealthCheckController';
import logger from './utils/Logger';
import { errorHandler } from './utils/ErrorHandler';
import * as fs from 'fs';
import initializeElasticsearch from './infrastructure/config/ElasticsearchConnection';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
logger.info(`Selected Environment file: ${envFile}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config(); // Default to .env
}

(async () => {
  try {
    // Initialize ElasticSearch
    const esClient = await initializeElasticsearch();

    // Initialize IOC Container
    await initializeContainer(esClient);

    // Create the server
    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
    });

    // Set the error handling middleware
    server.setErrorConfig((app) => {
      app.use(errorHandler);
    });

    const app = server.build();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Failed to start the application', {
        message: error.message,
        stack: error.stack,
      });
    } else {
      logger.error('Failed to start the application due to an unknown error');
    }
    process.exit(1); // Exit the process with an error code
  }
})();
