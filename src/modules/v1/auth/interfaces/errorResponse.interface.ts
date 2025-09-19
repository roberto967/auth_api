import { HttpErrors } from '../../../../common/Enum/httpsErros.enum';
import { HttpError } from '../../../../error/http.error';

const STATUS_CODE = HttpErrors.BadRequest;
const MESSAGE = 'Validation Failed';

export const validationErrorExample: HttpError = {
  name: 'Validation Error',
  statusCode: STATUS_CODE,
  message: MESSAGE,
  details: [
    'email must be a valid email',
    'password must be at least 8 characters long',
    '...',
  ],
};
