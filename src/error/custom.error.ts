import { HttpError } from './http.error';
import { HttpErrors } from '../common/Enum/httpsErros.enum';

export class ConflictError extends HttpError {
  constructor(message: string, details: string[] = []) {
    super('ConflictError', HttpErrors.Conflict, message, details);
  }
}
