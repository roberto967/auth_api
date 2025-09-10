import express, { Application } from 'express';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './generated/routes';
import swaggerDoc from './generated/swagger.json';

function bootstrap(): Application {
  const app: Application = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  RegisterRoutes(app);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.listen(PORT, () => {
    console.log(`Server online na port: ${PORT}`);
    console.log(`Documentação: http://localhost:${PORT}/api-docs`);
  });
  return app;
}

bootstrap();
