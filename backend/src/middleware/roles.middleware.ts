import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ResponseUtil } from '../utils/response.util';

export type UserRole = 'admin' | 'editor' | 'user';

export const rolesMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.error(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      ResponseUtil.error(
        res,
        'Insufficient permissions. Required roles: ' + allowedRoles.join(', '),
        403
      );
      return;
    }

    next();
  };
};

export const adminOnly = rolesMiddleware('admin');
export const adminOrEditor = rolesMiddleware('admin', 'editor');

