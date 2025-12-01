import { Request, Response } from 'express';
import { ReviewsService } from '../services/reviews.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

const reviewsService = new ReviewsService();

export class ReviewsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const review = await reviewsService.create(req.body);
      ResponseUtil.success(res, review, 'Review submitted successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to create review', 500, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const review = await reviewsService.findById(id, language || 'en');
      
      if (!review) {
        ResponseUtil.error(res, 'Review not found', 404);
        return;
      }
      
      ResponseUtil.success(res, review);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get review', 500, error);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await reviewsService.list(req.query as any);
      ResponseUtil.paginated(
        res,
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Reviews retrieved successfully'
      );
    } catch (error: any) {
      console.error('Reviews list error:', error);
      // If database connection fails, return empty array instead of error
      if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
        ResponseUtil.paginated(res, [], 1, 10, 0, 'Database not connected - showing empty results');
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to list reviews', 500, error);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const review = await reviewsService.update(id, req.body);
      ResponseUtil.success(res, review, 'Review updated successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Review not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to update review', 500, error);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await reviewsService.delete(id);
      ResponseUtil.success(res, null, 'Review deleted successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Review not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to delete review', 500, error);
    }
  }

  async getRatingStats(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const stats = await reviewsService.getProductRatingStats(productId);
      ResponseUtil.success(res, stats, 'Rating statistics retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get rating statistics', 500, error);
    }
  }
}

