import { HttpError } from './http.error';
import { HttpErrors } from '../common/Enum/httpsErrors.enum';

export class ConflictError extends HttpError {
  constructor(message: string, details: string[] = []) {
    super('ConflictError', HttpErrors.Conflict, message, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string, details: string[] = []) {
    super('UnauthorizedError', HttpErrors.Unauthorized, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, details: string[] = []) {
    super('NotFoundError', HttpErrors.NotFound, message, details);
  }
}

export class InvalidCredentialsError extends HttpError {
  constructor(message: string, details: string[] = []) {
    super('InvalidCredentialsError', HttpErrors.Unauthorized, message, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string, details: string[] = []) {
    super('ForbiddenError', HttpErrors.Forbidden, message, details);
  }
}
