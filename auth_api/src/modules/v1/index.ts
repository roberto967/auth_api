import { Router, Request, Response, NextFunction } from 'express';
import { RegisterRoutes as RegisterRoutesV1 } from '../../generated/v1/routes';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

const swaggerPath = path.resolve(__dirname, '../../generated/v1/swagger.json');

const router = Router();

RegisterRoutesV1(router);

router.use(
  '/api-docs',
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const swaggerDoc = JSON.parse(
      fs.readFileSync(swaggerPath, 'utf8'),
    ) as JsonObject;
    swaggerUi.setup(swaggerDoc)(req, res, next);
  },
);

export default router;
