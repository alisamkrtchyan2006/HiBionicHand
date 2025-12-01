import { Request, Response } from 'express';
import { ProductsService } from '../services/products.service';
import { ResponseUtil } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

const productsService = new ProductsService();

export class ProductsController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const product = await productsService.create({
        ...req.body,
        createdBy: userId,
      });
      ResponseUtil.success(res, product, 'Product created successfully', 201);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to create product', 500, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const product = await productsService.findById(id, language || 'en');
      
      if (!product) {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }
      
      ResponseUtil.success(res, product);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get product', 500, error);
    }
  }

  async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { language } = req.query as { language?: 'en' | 'ru' | 'arm' };
      const product = await productsService.findBySlug(slug, language || 'en');
      
      if (!product) {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }
      
      ResponseUtil.success(res, product);
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to get product', 500, error);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const result = await productsService.list(req.query as any);
      ResponseUtil.paginated(
        res,
        result.data,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total,
        'Products retrieved successfully'
      );
    } catch (error: any) {
      console.error('Products list error:', error);
      // If database connection fails, return empty array instead of error
      if (error.code === 'P1001' || error.message?.includes('connect') || error.message?.includes('database')) {
        ResponseUtil.paginated(res, [], 1, 10, 0, 'Database not connected - showing empty results');
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to list products', 500, error);
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productsService.update(id, req.body);
      ResponseUtil.success(res, product, 'Product updated successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to update product', 500, error);
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await productsService.delete(id);
      ResponseUtil.success(res, null, 'Product deleted successfully');
    } catch (error: any) {
      if (error.code === 'P2025') {
        ResponseUtil.error(res, 'Product not found', 404);
        return;
      }
      ResponseUtil.error(res, error.message || 'Failed to delete product', 500, error);
    }
  }
}

