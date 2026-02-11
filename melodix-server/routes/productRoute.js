import { Router } from 'express';
import { getProducts, getProductBySlug } from '../controllers/productController.js';

const router = Router();

// GET /api/products : liste tous les produits 
// GET /api/products/:slug : détails d'un produit 
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;