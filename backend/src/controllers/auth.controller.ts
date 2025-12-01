import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response.util';
import prisma from '../database/prisma.client';
import { AuthRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      ResponseUtil.success(res, result, 'Login successful');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Login failed', 401, error);
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      ResponseUtil.success(res, result, 'Registration successful', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Registration failed', 400, error);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      ResponseUtil.success(res, result, 'Token refreshed successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Token refresh failed', 401, error);
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      // This endpoint requires auth middleware
      // The user will be attached to req by authMiddleware
      const user = req.user;
      if (!user) {
        ResponseUtil.error(res, 'User not found', 401);
        return;
      }

      // Fetch full user details
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      if (!fullUser) {
        ResponseUtil.error(res, 'User not found', 404);
        return;
      }

      ResponseUtil.success(res, fullUser, 'User retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get user', 500, error);
    }
  }
}

