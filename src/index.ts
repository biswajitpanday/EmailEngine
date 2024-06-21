import 'reflect-metadata';
import dotenv from 'dotenv';
import * as fs from 'fs';
import logger from './utils/Logger';

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

import bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { errorHandler } from './utils/ErrorHandler';
import connectElasticsearch from './infrastructure/config/ElasticsearchConnection';
import { initializeElasticSearchIndexing } from './infrastructure/config/InitializeElasticSearchIndexing';
import { initializeIocContainer } from './infrastructure/di/container';

import './presentation/controllers/HealthCheckController';

(async () => {
  try {
    // Initialize ElasticSearch
    const esClient = await connectElasticsearch();

    // Initialize ElasticSearch Indexes
    await initializeElasticSearchIndexing(esClient); // todo: fix this

    // Initialize IOC Container
    const container = await initializeIocContainer(esClient);

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
