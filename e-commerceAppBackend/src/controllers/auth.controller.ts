import { HydratedDocument, Types } from 'mongoose';
import { User } from '../models/user.model';
import ExtendedRequest, { ICartDetail, StatusError, UserRequest } from '../types';
import { NextFunction, Request, Response } from 'express';
import { CONSTANTS, ERROR_MESSAGE, RESPONSE_MESSAGE } from '../common/constants';
import bcrypt from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import { BlacklistJWT } from '../models/blacklistJWT.model';
import { MailService } from '../../utils/mailingService';
import { getSignUpTemplate, resetPasswordTemplate } from '../../utils/emailTemplates';
import crypto = require('crypto');

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const userDetail = req.body;

  try {
    const userData = await User.findOne({ email: userDetail.email });

    if (userData) {
      const err = new StatusError(ERROR_MESSAGE.userExists);
      err.status = 422;
      return next(err);
    }
    const hashedPw = await bcrypt.hash(userDetail.password, CONSTANTS.PASSWORD_SALT);

    const newUser: HydratedDocument<UserRequest> = new User({
      name: userDetail.name,
      password: hashedPw,
      role: process.env.DEFAULT_USER_ROLE!,
      email: userDetail.email,
      productsInCart: { totalPrice: 0, products: [] },
      productsInWishList: [],
    });

    const userResponse = await newUser.save();
    const mailServiceInstance: MailService = MailService.getMailServiceInstance();
    await mailServiceInstance.sentMail({
      to: userResponse.email,
      subject: RESPONSE_MESSAGE.newAccountEmailSubject,
      html: getSignUpTemplate(userResponse.name),
    });

    return res.json({
      ...userResponse.toObject(),
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const userDetail = req.body;

  try {
    const userData = await User.findOne({ email: userDetail.email });
    if (!userData) {
      const err = new StatusError(ERROR_MESSAGE.invalidCredentials);
      err.status = 422;
      return next(err);
    }
    const doesMatch = await bcrypt.compare(userDetail.password, userData.password);
    if (!doesMatch) {
      const err = new StatusError(ERROR_MESSAGE.invalidCredentials);
      err.status = 422;
      return next(err);
    }

    const token = createJWT(userData.email, userData._id.toString());

    return res.json({ token, id: userData._id });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const sendForgotPasswordMail = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  try {
    const userData = await User.findOne({ email });
    if (!userData) {
      const err = new StatusError(ERROR_MESSAGE.userDoesNotExists);
      err.status = 414;
      return next(err);
    }

    crypto.randomBytes(CONSTANTS.CRYPTO_BYTE_SIZE, async (err, buf) => {
      if (!err) {
        userData.resetToken = buf.toString('hex');
        userData.resetTokenExpires = new Date(Date.now() + +process.env.RESET_TOKEN_EXPIRATION! * 1000);
        await userData.save();

        const mailServiceInstance = MailService.getMailServiceInstance();
        await mailServiceInstance.sentMail({
          to: userData.email,
          subject: RESPONSE_MESSAGE.newPasswordEmailSubject,
          html: resetPasswordTemplate(userData.resetToken),
        });

        return res.json({ ...userData.toObject() });
      }
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const resetToken = req.body.resetToken;
  if (password !== confirmPassword) {
    const err = new StatusError(ERROR_MESSAGE.badRequest);
    err.status = 417;
    return next(err);
  }
  try {
    const userData = await User.findOne({ resetToken, resetTokenExpires: { $gt: new Date() } });
    if (!userData) {
      const err = new StatusError(ERROR_MESSAGE.userDoesNotExists);
      err.status = 401;
      return next(err);
    }

    const hashedPw = await bcrypt.hash(password, CONSTANTS.PASSWORD_SALT);
    userData.password = hashedPw;
    userData.resetToken = undefined;
    userData.resetTokenExpires = undefined;
    await userData.save();
    return res.json({ ...userData.toObject() });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as ExtendedRequest).userId;
  const token = (req as ExtendedRequest).token;
  const updateData: { productsInCart: ICartDetail; productsInWishList: string[] } = req.body.updateData;
  try {
    const userData = await User.findById(userId);
    if (!userData) {
      const err = new StatusError(ERROR_MESSAGE.invalidCredentials);
      err.status = 422;
      return next(err);
    }

    userData.productsInCart = updateData.productsInCart;
    userData.productsInWishList = updateData.productsInWishList.map((prodId) => new Types.ObjectId(prodId));
    await userData.save();
    const blacklistJWT = new BlacklistJWT({ token, userId });
    await blacklistJWT.save();
    return res.json({ ...userData.toObject() });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

function createJWT(email: string, userId: string) {
  let jwtToken;
  try {
    jwtToken = jsonWebToken.sign({ email, sub: userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRATION!,
    });
  } catch (err) {
    const error = new StatusError(ERROR_MESSAGE.default + 'Failed to create JSON web token');
    error.status = 500;
    throw error;
  }
  return jwtToken;
}
