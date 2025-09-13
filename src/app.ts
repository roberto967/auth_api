import express, { Application } from 'express';
import 'reflect-metadata';
import helmet from 'helmet';
import cors from 'cors';
import v1 from './modules/v1';
import { errorHandler } from './middlewares/error.middleware';
import passport from 'passport';
import { appDataSource } from './database/dbConnection';

import { Request, Response } from 'express';

export function createApp(): Application {
  const app: Application = express();

  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(passport.initialize());

  app.use('/v1', v1);

  app.get('/testDB', (req: Request, res: Response) => {
    try {
      res.send('Connected to database');
      const entities = appDataSource.entityMetadatas.map(entity => entity.name);
      console.log('Entidades registradas:', entities);
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      res.status(500).send('Database connection error');
    }
  });

  app.use(errorHandler);

  return app;
}
