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
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
// import cron from 'node-cron';
import { InversifyExpressServer } from 'inversify-express-utils';
import { errorHandler } from './utils/ErrorHandler';
import connectElasticsearch from './infrastructure/config/ElasticsearchConnection';
import { initializeElasticSearchIndexing } from './infrastructure/config/InitializeElasticSearchIndexing';
import { initializeIocContainer } from './infrastructure/di/container';
// import { TYPES } from './infrastructure/di/types';
// import { EmailSyncService } from './application/services/EmailSyncService';

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

    logger.info(`Cors Origin: ${process.env.CORS_ORIGIN}`);
    server.setConfig((app) => {
      app.use(
        cors({
          origin: process.env.CORS_ORIGIN || '*',
          credentials: true,
        }),
      );
      app.use(cookieParser());
      app.use(
        session({
          secret: 'emailsherlockengine',
          resave: false,
          saveUninitialized: true,
          cookie: { secure: process.env.NODE_ENV === 'production' },
        }),
      );
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

    // Schedule email synchronization task
    // const emailSyncService = container.get<EmailSyncService>(
    //   TYPES.EmailSyncService,
    // );
    // cron.schedule('*/1 * * * *', async () => {
    //   logger.info('Starting email synchronization task');
    //   await emailSyncService.syncEmails();
    // });
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
