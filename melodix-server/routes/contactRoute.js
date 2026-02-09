import { Router } from 'express';
import { contactUser } from '../controllers/contactController.js';

// Initialisation du router express //
const router = Router();

// Routes //
router.post('/', contactUser);

// Exportation du router //
export default router;