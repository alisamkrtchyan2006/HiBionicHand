import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminOrEditor } from '../middleware/roles.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createNewsDto,
  updateNewsDto,
  getNewsDto,
  listNewsDto,
  deleteNewsDto,
} from '../dto/news.dto';

const router = Router();
const newsController = new NewsController();

// Public routes
router.get(
  '/',
  validate(listNewsDto),
  newsController.list.bind(newsController)
);

router.get(
  '/slug/:slug',
  validate(getNewsDto),
  newsController.getBySlug.bind(newsController)
);

router.get(
  '/:id',
  validate(getNewsDto),
  newsController.getById.bind(newsController)
);

// Protected routes (Admin/Editor only)
router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createNewsDto),
  newsController.create.bind(newsController)
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateNewsDto),
  newsController.update.bind(newsController)
);

router.delete(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(deleteNewsDto),
  newsController.delete.bind(newsController)
);

export default router;

