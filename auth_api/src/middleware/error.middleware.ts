import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../error/http.error';
import { unexpectedErrorExample } from '../error/example/unexpected.example';
import { HttpErrors } from '../common/Enum/httpsErros.enum';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`Route: ${req.method} ${req.originalUrl}`);
  console.log(`[Trace] ${err.stack}`);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  return res
    .status(HttpErrors.InternalServerError)
    .json(unexpectedErrorExample);
}
