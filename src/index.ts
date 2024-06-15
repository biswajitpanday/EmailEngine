import 'reflect-metadata';
import { InversifyExpressServer, interfaces } from 'inversify-express-utils';
import { container } from './infrastructure/di/container';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import './presentation/controllers/HealthCheckController';
import logger from './utils/Logger';

dotenv.config();

// Create the server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
});

const app = server.build();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
