import { HttpErrors } from '../../common/Enum/httpsErrors.enum';
import { IErrorResponse } from '../interface/error.interface';

export const forbiddenErrorExample: IErrorResponse = {
  name: 'ForbiddenError',
  statusCode: HttpErrors.Forbidden,
  message: 'Your account is not active. Please contact support.',
  details: [],
};

export const invalidCredentialsErrorExample: IErrorResponse = {
  name: 'InvalidCredentialsError',
  statusCode: HttpErrors.Unauthorized,
  message: 'Invalid email or password.',
  details: [],
};

export const invalidConfirmationTokenExample: IErrorResponse = {
  name: 'UnauthorizedError',
  statusCode: HttpErrors.Unauthorized,
  message: 'Invalid or expired confirmation token.',
  details: [],
};

export const invalidRefreshTokenExample: IErrorResponse = {
  name: 'UnauthorizedError',
  statusCode: HttpErrors.Unauthorized,
  message: 'Invalid refresh token.',
  details: [],
};

export const expiredRefreshTokenExample: IErrorResponse = {
  name: 'UnauthorizedError',
  statusCode: HttpErrors.Unauthorized,
  message: 'Refresh token expired.',
  details: [],
};
