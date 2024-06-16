import 'reflect-metadata';
import { InversifyExpressServer, interfaces } from "inversify-express-utils";
import { container } from "./infrastructure/di/container";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import "./presentation/controllers/HealthCheckController";
import logger from "./utils/Logger";
import { errorHandler } from "./utils/ErrorHandler";

dotenv.config();

try {
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

connectDB();

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    logger.error("Failed to start the application", {
      message: error.message,
      stack: error.stack,
    });
  } else {
    logger.error("Failed to start the application due to an unknown error");
  }
  process.exit(1); // Exit the process with an error code
}
