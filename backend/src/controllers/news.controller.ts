import { Request, Response } from 'express';
import { NewsService } from '../services/news.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

const newsService = new NewsService();

export class NewsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt) : undefined;
      const news = await newsService.create({
        ...req.body,
        authorId: userId,
        publishedAt,
      });
      ResponseUtil.success(res, news, 'News article created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to create news article', 500, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const news = await newsService.findById(id, language || 'en');
      
      if (!news) {
        ResponseUtil.error(res, 'News article not found', 404);
        return;
      }
      
      ResponseUtil.success(res, news);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get news article', 500, error);
    }
  }

  async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const news = await newsService.findBySlug(slug, language || 'en');
      
      if (!news) {
        ResponseUtil.error(res, 'News article not found', 404);
        return;
      }
      
      ResponseUtil.success(res, news);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get news article', 500, error);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await newsService.list(req.query as any);
      ResponseUtil.paginated(
        res,
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'News articles retrieved successfully'
      );
    } catch (error: any) {
      console.error('News list error:', error);
      // If database connection fails, return empty array instead of error
      if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
        ResponseUtil.paginated(res, [], 1, 10, 0, 'Database not connected - showing empty results');
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to list news articles', 500, error);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt) : req.body.publishedAt;
      const news = await newsService.update(id, {
        ...req.body,
        publishedAt,
      });
      ResponseUtil.success(res, news, 'News article updated successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'News article not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to update news article', 500, error);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await newsService.delete(id);
      ResponseUtil.success(res, null, 'News article deleted successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'News article not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to delete news article', 500, error);
    }
  }
}

