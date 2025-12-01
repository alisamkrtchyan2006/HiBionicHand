import { Router } from 'express';
import { ReviewsController } from '../controllers/reviews.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminOrEditor } from '../middleware/roles.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createReviewDto,
  updateReviewDto,
  getReviewDto,
  listReviewsDto,
  deleteReviewDto,
} from '../dto/reviews.dto';

const router = Router();
const reviewsController = new ReviewsController();

// Public routes
router.get(
  '/',
  validate(listReviewsDto),
  reviewsController.list.bind(reviewsController)
);

router.get(
  '/product/:productId/stats',
  reviewsController.getRatingStats.bind(reviewsController)
);

router.get(
  '/:id',
  validate(getReviewDto),
  reviewsController.getById.bind(reviewsController)
);

// Public submission (no auth required)
router.post(
  '/',
  validate(createReviewDto),
  reviewsController.create.bind(reviewsController)
);

// Protected routes (Admin/Editor only)
router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateReviewDto),
  reviewsController.update.bind(reviewsController)
);

router.delete(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(deleteReviewDto),
  reviewsController.delete.bind(reviewsController)
);

export default router;

