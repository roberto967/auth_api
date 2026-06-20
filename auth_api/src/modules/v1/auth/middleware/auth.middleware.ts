import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../../user/entities/user.entity';
import { InvalidCredentialsError } from '../../../../error/custom.error';

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
          const error = new InvalidCredentialsError(
            info?.message || 'Invalid email or password.',
          );
          return res.status(error.statusCode).json(error.toJSON());
        }
        req.user = user;
        next();
      },
    ) as (req: Request, res: Response, next: NextFunction) => void
  )(req, res, next);
}
