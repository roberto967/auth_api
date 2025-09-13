import express, { Application } from 'express';
import 'reflect-metadata';
import helmet from 'helmet';
import cors from 'cors';
import v1 from './modules/v1';
import { errorHandler } from './middlewares/error.middleware';

export function createApp(): Application {
  const app: Application = express();

  app.use(helmet());
  app.use(cors());

  app.use(express.json());

  app.use('/v1', v1);

  app.use(errorHandler);

  return app;
}
