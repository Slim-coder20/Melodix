import { Router } from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/auth.js';

// Initialisation du router express //
const router = Router();

// Routes //
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


// Exportation du router //
export default router;
