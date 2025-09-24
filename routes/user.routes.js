import { Router } from 'express';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser
} from '../controllers/user.controllers.js';
import { validateUpdateUserInput } from '../validation/validators.js';
import validate from '../middleware/validation.middleware.js';
import {
  authorisePermissions,
  checkForTestUser
} from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

router.get('/current-user', getCurrentUser);
router.get(
  '/admin/application-stats',
  authorisePermissions('admin'),
  getApplicationStats
);
router.patch(
  '/update-user',
  checkForTestUser,
  upload.single('avatar'),
  validateUpdateUserInput(),
  validate,
  updateUser
);

export default router;
