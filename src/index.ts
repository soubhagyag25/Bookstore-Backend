import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
let swaggerDocument: any = require('../src/swagger/swaggerFile.json');

import routes from './routes';
import ErrorHandler from './middlewares/error.middleware';
import Logger from './config/logger';

class App {
  public app: Application;
  public host: string | number;
  public port: string | number;
  public api_version: string | number;
  public env: boolean;
  private logStream = Logger.logStream;
  private logger = Logger.logger;
  public errorHandler = new ErrorHandler();

  constructor() {
    this.app = express();
    this.host = process.env.APP_HOST;
    this.port = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.APP_PORT; // Use TEST_PORT for test environment
    this.api_version = process.env.API_VERSION;

    this.initializeMiddleWares();
    this.initializeRoutes();
    this.initializeErrorHandlers();
    
    if (process.env.NODE_ENV !== 'test') {
      this.startApp(); // Start app only if not in test environment
    }
  }

  public initializeMiddleWares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan('combined', { stream: this.logStream }));
  }

  public initializeRoutes(): void {
    // Swagger UI setup
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Swagger UI endpoint
    
    // Your API routes
    this.app.use(`/api/${this.api_version}`, routes());
  }

  public initializeErrorHandlers(): void {
    this.app.use(this.errorHandler.appErrorHandler);
    this.app.use(this.errorHandler.genericErrorHandler);
    this.app.use(this.errorHandler.notFound);
  }

  public startApp(): void {
    this.app.listen(this.port, () => {
      this.logger.info(
        `Server started at ${this.host}:${this.port}/api/${this.api_version}/`
      );
    });
  }

  // Expose the express app instance
  public getApp(): Application {
    return this.app;
  }
}

// Export an instance of the App class
const appInstance = new App();

// Export the Express app instance
export const app = appInstance.getApp();
