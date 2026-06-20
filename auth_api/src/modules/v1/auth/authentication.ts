import { Request, Response, NextFunction, RequestHandler } from 'express';
import passport from 'passport';
import { User } from '../user/entities/user.entity';
import { UnauthorizedError } from '../../../error/custom.error';

export function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[],
): Promise<User> {
  if (securityName === 'jwt') {
    return new Promise((resolve, reject) => {
      const handler: RequestHandler = passport.authenticate(
        'jwt',
        { session: false },
        (err: Error, user: User, info: { message?: string } | undefined) => {
          if (err) {
            return reject(err);
          }
          if (!user) {
            return reject(
              new UnauthorizedError(info?.message || 'Unauthorized access'),
            );
          }
          return resolve(user);
        },
      ) as RequestHandler;

      handler(request, {} as Response, (() => {}) as NextFunction);
    });
  }

  return Promise.reject(new Error('Unknown security name'));
}
