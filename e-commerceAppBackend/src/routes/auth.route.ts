import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { isAuth } from '../middlewares/auth-middleware';

const router = Router();

router.post('/sign-up', authController.createUser);

router.post('/sign-in', authController.signIn);

router.post('/forgot-password', authController.sendForgotPasswordMail);

router.post('/reset-password', authController.resetPassword);

router.post('/logout-user', isAuth, authController.logoutUser);

export default router;
