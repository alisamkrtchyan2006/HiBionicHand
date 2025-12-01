import { Router } from 'express';
import { ContactsController } from '../controllers/contacts.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminOrEditor } from '../middleware/roles.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createContactDto,
  updateContactDto,
  getContactDto,
  listContactsDto,
  submitContactFormDto,
  deleteContactDto,
} from '../dto/contacts.dto';

const router = Router();
const contactsController = new ContactsController();

// Public routes
router.get(
  '/',
  validate(listContactsDto),
  contactsController.list.bind(contactsController)
);

router.get(
  '/:id',
  validate(getContactDto),
  contactsController.getById.bind(contactsController)
);

// Public contact form submission
router.post(
  '/submit',
  validate(submitContactFormDto),
  contactsController.submitForm.bind(contactsController)
);

// Protected routes (Admin/Editor only)
router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createContactDto),
  contactsController.create.bind(contactsController)
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateContactDto),
  contactsController.update.bind(contactsController)
);

router.delete(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(deleteContactDto),
  contactsController.delete.bind(contactsController)
);

// Contact form submissions (Admin only)
router.get(
  '/submissions/list',
  authMiddleware,
  adminOrEditor,
  contactsController.getSubmissions.bind(contactsController)
);

export default router;

