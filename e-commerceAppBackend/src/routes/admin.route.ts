import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
const router = Router();
import * as authMiddleware from '../middlewares/auth-middleware';

router.use(authMiddleware.isAuth);

router.post('/add-product', authMiddleware.isAdmin, adminController.saveNewProduct);

router.post('/add-category', authMiddleware.isAdmin, adminController.saveCategory);

router.delete('/delete-product/:productId', authMiddleware.isAdmin, adminController.deleteProductById);

router.patch('/edit-product/:productId', authMiddleware.isAdmin, adminController.editProductById);

router.patch('/edit-user-status/:userId', authMiddleware.isAdmin, adminController.editUserStatusById);

router.get('/all-users', authMiddleware.isAdmin, adminController.getAllUsers);

router.get('/all-orders', authMiddleware.isAdmin, adminController.getAllOrders);

router.get('/all-reports', authMiddleware.isAdmin, adminController.getAllReports);

export default router;
