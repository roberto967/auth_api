import { Router } from 'express';
import { RegisterRoutes as RegisterRoutesV1 } from '../../generated/v1/routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../generated/v1/swagger.json';

const router = Router();

RegisterRoutesV1(router);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default router;
