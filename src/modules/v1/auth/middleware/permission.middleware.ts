import { Request, Response, NextFunction } from 'express';
import { User } from '../../user/entities/user.entity';
import { ForbiddenError } from '../../../../error/custom.error';
import { UserRole } from '../enum/userRole.enum';

export function requirePermissions(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user || !user.role || !user.role.permissions) {
      throw new ForbiddenError(
        'You are not authorized to access this resource.',
        [],
      );
    }

    // Admins bypass permission checks
    if (user.role.name === UserRole.ADMIN) {
      return next();
    }

    const userPermissions = user.role.permissions.map(p => p.name);

    const hasAllPermissions = requiredPermissions.every(p =>
      userPermissions.includes(p),
    );

    if (hasAllPermissions) {
      return next();
    } else {
      throw new ForbiddenError('You do not have the required permissions', []);
    }
  };
}
