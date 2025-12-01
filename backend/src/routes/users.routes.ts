import { Router } from 'express';
import { ResponseUtil } from '../utils/response.util';
import { Request, Response } from 'express';
import prisma from '../database/prisma.client';

const router = Router();

// Get all users (for admin panel)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || 1), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || 10), 10)));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    ResponseUtil.paginated(
      res,
      users,
      page,
      limit,
      total,
      'Users retrieved successfully'
    );
  } catch (error: any) {
    console.error('Users list error:', error);
    // If database connection fails, return empty array instead of error
    if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
      ResponseUtil.paginated(res, [], 1, 10, 0, 'Database not connected - showing empty results');
      return;
    }
    ResponseUtil.error(res, error.message || 'Failed to list users', 500, error);
  }
});

export default router;

