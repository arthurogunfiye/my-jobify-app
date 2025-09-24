import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controllers.js';
import {
  validateRegisterInput,
  validateLoginInput
} from '../validation/validators.js';
import validate from '../middleware/validation.middleware.js';

const router = Router();

router.post('/register', validateRegisterInput(), validate, register);
router.post('/login', validateLoginInput(), validate, login);
router.get('/logout', logout);

export default router;
