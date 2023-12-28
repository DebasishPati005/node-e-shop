import express, { Request, Response, NextFunction } from 'express';
import compression = require('compression');
import Helmet from 'helmet';
import morgan = require('morgan');
import shopRouter from '../src/routes/shop.route';
import adminRouter from '../src/routes/admin.route';
import authRouter from '../src/routes/auth.route';
import userRouter from '../src/routes/user.route';
import bodyParser = require('body-parser');
import { StatusError } from './types';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// used to compress the response
app.use(bodyParser.json());

// used to compress the response
app.use(compression());
// used to add security protection to response header
app.use(Helmet());
// used to log information of the request type response code etc
app.use(morgan('common'));

app.use('/shop', shopRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// special error handling route
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  return res.status(status).json({
    message: error.message,
    error: error.toString(),
  });
});

export default app;
