import { HttpErrors } from '../../common/Enum/httpsErros.enum';
import { IErrorResponse } from '../interface/error.interface';

const STATUS_CODE = HttpErrors.InternalServerError;
const MESSAGE = 'Unexpected error occurred';

export const unexpectedErrorExample: IErrorResponse = {
  name: 'InternalServerError',
  statusCode: STATUS_CODE,
  message: MESSAGE,
  details: null,
};
