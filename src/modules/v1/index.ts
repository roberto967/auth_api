import { Router } from 'express';
import { RegisterRoutes as RegisterRoutesV1 } from '../../generated/v1/routes';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

const swaggerPath = path.resolve(__dirname, '../../generated/v1/swagger.json');

const swaggerDoc: unknown = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const router = Router();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
RegisterRoutesV1(router);

router.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default router;
