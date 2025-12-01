import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseUtil } from '../utils/response.util';
import prisma from '../database/prisma.client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ResponseUtil.error(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      ResponseUtil.error(res, 'User not found or inactive', 401);
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      ResponseUtil.error(res, 'Invalid token', 401);
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      ResponseUtil.error(res, 'Token expired', 401);
      return;
    }
    ResponseUtil.error(res, 'Authentication failed', 401);
  }
};

