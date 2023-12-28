import { Router } from 'express';
import shopController = require('../controllers/shop.controller');

const router = Router();

router.get('/all-products', shopController.getAllProducts);

router.get('/product/:productId', shopController.getProductById);

router.get('/products-by-category', shopController.getProductsByCategory);

router.get('/all-categories', shopController.getAllCategories);

export default router;
