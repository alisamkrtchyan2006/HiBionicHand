import { Router } from 'express';
import { PartnersController } from '../controllers/partners.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminOrEditor } from '../middleware/roles.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createPartnerDto,
  updatePartnerDto,
  getPartnerDto,
  listPartnersDto,
  deletePartnerDto,
} from '../dto/partners.dto';

const router = Router();
const partnersController = new PartnersController();

// Public routes
router.get(
  '/',
  validate(listPartnersDto),
  partnersController.list.bind(partnersController)
);

router.get(
  '/:id',
  validate(getPartnerDto),
  partnersController.getById.bind(partnersController)
);

// Protected routes (Admin/Editor only)
router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createPartnerDto),
  partnersController.create.bind(partnersController)
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updatePartnerDto),
  partnersController.update.bind(partnersController)
);

router.delete(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(deletePartnerDto),
  partnersController.delete.bind(partnersController)
);

export default router;

