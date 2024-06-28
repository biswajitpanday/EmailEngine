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
import { InversifyExpressServer } from 'inversify-express-utils';
import { errorHandler } from './utils/ErrorHandler';
import connectElasticsearch from './infrastructure/config/ElasticsearchConnection';
import { initializeElasticSearchIndexing } from './infrastructure/config/InitializeElasticSearchIndexing';
import { initializeIocContainer } from './infrastructure/di/container';

import './presentation/controllers/HealthCheckController';
import AppConst from './utils/Constants';
import NgrokService from './infrastructure/config/NgrokService';

(async () => {
  try {
    // Initialize ngrok
    const ngrokService = NgrokService.getInstance();
    const ngrokUrl = await ngrokService.connect(3000);
    logger.info(`Public URL (NGROK): ${ngrokUrl}`);

    // Initialize ElasticSearch
    const esClient = await connectElasticsearch();

    // Initialize ElasticSearch Indexes
    await initializeElasticSearchIndexing(esClient); // todo: fix this

    // Initialize IOC Container
    const container = await initializeIocContainer(esClient);

    // Create the server
    const server = new InversifyExpressServer(container);

    logger.info(`Cors Origin: ${AppConst.CorsOrigin}`);
    server.setConfig((app) => {
      app.use(
        cors({
          origin: AppConst.CorsOrigin || '*',
          credentials: true,
        }),
      );
      app.use(cookieParser());
      app.use(
        session({
          secret: 'emailsherlockengine',
          resave: false,
          saveUninitialized: true,
          cookie: { secure: AppConst.NodeEnv === 'production' },
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
    const port = AppConst.Port || 3000;

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
