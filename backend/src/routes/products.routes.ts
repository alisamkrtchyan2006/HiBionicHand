import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { adminOrEditor } from '../middleware/roles.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createProductDto,
  updateProductDto,
  getProductDto,
  listProductsDto,
  deleteProductDto,
} from '../dto/products.dto';

const router = Router();
const productsController = new ProductsController();

// Public routes
router.get(
  '/',
  validate(listProductsDto),
  productsController.list.bind(productsController)
);

router.get(
  '/slug/:slug',
  validate(getProductDto),
  productsController.getBySlug.bind(productsController)
);

router.get(
  '/:id',
  validate(getProductDto),
  productsController.getById.bind(productsController)
);

// Protected routes (Admin/Editor only)
router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createProductDto),
  productsController.create.bind(productsController)
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateProductDto),
  productsController.update.bind(productsController)
);

router.delete(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(deleteProductDto),
  productsController.delete.bind(productsController)
);

export default router;

