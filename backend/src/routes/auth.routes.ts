import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginDto, registerDto, refreshTokenDto } from '../dto/auth.dto';

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  '/login',
  validate(loginDto),
  authController.login.bind(authController)
);

router.post(
  '/register',
  validate(registerDto),
  authController.register.bind(authController)
);

router.post(
  '/refresh',
  validate(refreshTokenDto),
  authController.refreshToken.bind(authController)
);

// Protected route
router.get(
  '/me',
  authMiddleware,
  authController.me.bind(authController)
);

export default router;

