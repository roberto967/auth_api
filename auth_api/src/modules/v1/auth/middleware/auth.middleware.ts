import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../../user/entities/user.entity';
import { IErrorResponse } from '../../../../error/interface/error.interface';
import { HttpErrors } from '../../../../common/Enum/httpsErrors.enum';

export function localAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  (
    passport.authenticate(
      'local',
      { session: false },
      (err: Error, user: User, info: { message?: string } | undefined) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          const errorResponse: IErrorResponse = {
            name: 'InvalidCredentialsError',
            statusCode: HttpErrors.Unauthorized,
            message: info?.message || 'Invalid email or password.',
            details: [],
          };
          return res.status(HttpErrors.Unauthorized).json(errorResponse);
        }
        req.user = user;
        next();
      },
    ) as (req: Request, res: Response, next: NextFunction) => void
  )(req, res, next);
}

/* export function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  (
    passport.authenticate(
      'jwt',
      { session: false },
      (err: Error, user: User, info: { message?: string } | undefined) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          const errorResponse: IErrorResponse = {
            name: 'UnauthorizedError',
            statusCode: HttpErrors.Unauthorized,
            message: info?.message || 'Unauthorized access.',
            details: null,
          };
          return res.status(HttpErrors.Unauthorized).json(errorResponse);
        }
        req.user = user;
        next();
      },
    ) as (req: Request, res: Response, next: NextFunction) => void
  )(req, res, next);
} */
