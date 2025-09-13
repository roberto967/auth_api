import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../error/http.error';

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
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: 'Unexpected error.',
  });
}
