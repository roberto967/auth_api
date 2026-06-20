import { Router } from 'express';
import { RegisterRoutes as RegisterRoutesV1 } from '../../generated/v1/routes';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

const swaggerPath = path.resolve(__dirname, '../../generated/v1/swagger.json');

const swaggerDoc = JSON.parse(
  fs.readFileSync(swaggerPath, 'utf8'),
) as JsonObject;

const router = Router();

RegisterRoutesV1(router);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default router;
