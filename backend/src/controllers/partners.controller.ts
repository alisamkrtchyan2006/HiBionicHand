import { Request, Response } from 'express';
import { PartnersService } from '../services/partners.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

const partnersService = new PartnersService();

export class PartnersController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const partner = await partnersService.create(req.body);
      ResponseUtil.success(res, partner, 'Partner created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to create partner', 500, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const partner = await partnersService.findById(id, language || 'en');
      
      if (!partner) {
        ResponseUtil.error(res, 'Partner not found', 404);
        return;
      }
      
      ResponseUtil.success(res, partner);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get partner', 500, error);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await partnersService.list(req.query as any);
      ResponseUtil.paginated(
        res,
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Partners retrieved successfully'
      );
    } catch (error: any) {
      console.error('Partners list error:', error);
      // If database connection fails, return empty array instead of error
      if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
        ResponseUtil.paginated(res, [], 1, 10, 0, 'Database not connected - showing empty results');
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to list partners', 500, error);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const partner = await partnersService.update(id, req.body);
      ResponseUtil.success(res, partner, 'Partner updated successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Partner not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to update partner', 500, error);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await partnersService.delete(id);
      ResponseUtil.success(res, null, 'Partner deleted successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Partner not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to delete partner', 500, error);
    }
  }
}

