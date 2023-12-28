import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { isAuth } from '../middlewares/auth-middleware';

const router = Router();

router.post('/add-order', isAuth, userController.postOrder);

router.get('/orders', isAuth, userController.getOrders);

router.get('/download-order-invoice/:orderId', userController.downloadOrdersInvoice);

router.get('/user-data', userController.getUserData);

router.post('/add-report', isAuth, userController.postReport);

export default router;
