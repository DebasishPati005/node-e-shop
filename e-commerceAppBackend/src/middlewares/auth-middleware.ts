import { NextFunction, Request, Response } from 'express';
import ExtendedRequest, { StatusError } from '../types';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { BlacklistJWT } from '../models/blacklistJWT.model';
import { ERROR_MESSAGE } from '../common/constants';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const jwtToken = req.get('Authorization');
  let decodedToken;
  if (!jwtToken) {
    const error = new StatusError(ERROR_MESSAGE.unauthorizedRequest);
    error.status = 401;
    return next(error);
  }
  try {
    const token = jwtToken.split(' ')[1];
    BlacklistJWT.findOne({ token })
      .then((tokenDetails) => {
        if (tokenDetails) {
          const error = new StatusError(ERROR_MESSAGE.unauthorizedRequest);
          error.status = 401;
          return next(error);
        } else {
          decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
          (req as ExtendedRequest).userId = decodedToken.sub?.toString();
          (req as ExtendedRequest).token = token;
          return next();
        }
      })
      .catch(() => {
        const error = new StatusError(ERROR_MESSAGE.default);
        error.status = 401;
        return next(error);
      });
  } catch {
    const error = new StatusError(ERROR_MESSAGE.unauthorizedRequest);
    error.status = 401;
    return next(error);
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as ExtendedRequest).userId;

  try {
    const userData = await User.findById(userId);
    if (!userData || userData.role != 'admin') {
      const error = new StatusError(ERROR_MESSAGE.forbiddenRequest);
      error.status = 403;
      return next(error);
    }
    return next();
  } catch {
    const error = new StatusError(ERROR_MESSAGE.unauthorizedRequest);
    error.status = 401;
    return next(error);
  }
};
