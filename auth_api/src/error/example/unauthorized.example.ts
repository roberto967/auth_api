import { HttpErrors } from '../../common/Enum/httpsErrors.enum';
import { IErrorResponse } from '../interface/error.interface';

const STATUS_CODE = HttpErrors.Unauthorized;

export const forbiddenErrorExample: IErrorResponse = {
  name: 'ForbiddenError',
  statusCode: STATUS_CODE,
  message: 'You are not authorized to access this resource.',
  details: [],
};

export const invalidCredentialsErrorExample: IErrorResponse = {
  name: 'InvalidCredentialsError',
  statusCode: STATUS_CODE,
  message: 'Invalid email or password.',
  details: [],
};
