import { HttpErrors } from '../../common/Enum/httpsErros.enum';
import { IErrorResponse } from '../interface/error.interface';

const STATUS_CODE = HttpErrors.BadRequest;
const MESSAGE = 'Validation Failed';

export const validationErrorExample: IErrorResponse = {
  name: 'Validation Error',
  statusCode: STATUS_CODE,
  message: MESSAGE,
  details: [
    'email must be a valid email',
    'password must be at least 8 characters long',
    '<obrigatory field> is required',
    '...',
  ],
};

export const conflictErrorExample: IErrorResponse = {
  name: 'ConflictError',
  statusCode: HttpErrors.Conflict,
  message: '',
  details: [],
};
