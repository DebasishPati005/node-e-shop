import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGE, RESPONSE_MESSAGE } from '../common/constants';
import { User } from '../models/user.model';
import ExtendedRequest, {
  OrderModel,
  OrderRequest,
  OrderResponse,
  OrderedProductResponse,
  ProductResponse,
  ReportRequest,
  StatusError,
} from '../types';
import { Order } from '../models/order.model';
import fs = require('fs');
import generateInvoicePdf from '../../utils/generateInvoicePdf';
import { MailService } from '../../utils/mailingService';
import { orderPlacedTemplate } from '../../utils/emailTemplates';
import { Report } from '../models/report.model';

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;

  try {
    const userData = await User.findById(id).populate('productsInCart.products.productId');

    if (!userData) {
      const err = new StatusError(ERROR_MESSAGE.invalidCredentials);
      err.status = 422;
      return next(err);
    }

    const filteredCartProducts = userData.productsInCart.products.map((prod: any) => {
      return {
        quantity: prod.quantity,
        ...prod.productId.toObject(),
      };
    });

    const filteredUserData = { ...userData.toObject(), productsInCart: filteredCartProducts };
    return res.json(filteredUserData);
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as ExtendedRequest).userId;
  try {
    const userData = await User.findById(userId);

    if (!userData) {
      const err = new StatusError(ERROR_MESSAGE.invalidCredentials);
      err.status = 422;
      return next(err);
    }

    const orderData: OrderRequest = req.body;
    const newOrder = new Order({ ...orderData, userId });
    const orderDetails = await newOrder.save();

    const mailServiceInstance: MailService = MailService.getMailServiceInstance();
    await mailServiceInstance.sentMail({
      to: userData.email,
      subject: RESPONSE_MESSAGE.orderPlacedEmailSubject,
      html: orderPlacedTemplate(orderDetails._id.toString()),
    });

    return res.json({ ...newOrder.toObject() });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as ExtendedRequest).userId;
  try {
    const allOrders: OrderModel[] = await Order.find({ userId }).populate('productsOrdered.products.productId');
    const filteredOrderedProducts = allOrders.map((orderDetail: any) => {
      const prodDetail = orderDetail.productsOrdered.products.map((prod: any) => {
        return {
          quantity: prod.quantity,
          ...prod.productId.toObject(),
        };
      });
      return { ...orderDetail.toObject(), productsOrdered: { products: prodDetail, totalPrice: orderDetail.productsOrdered.totalPrice } };
    });
    return res.json(filteredOrderedProducts);
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const downloadOrdersInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;
  try {
    const orderDetail = await Order.findById(orderId).populate('productsOrdered.products.productId');
    if (!orderDetail) {
      const err = new StatusError(ERROR_MESSAGE.badRequest);
      err.status = 422;
      throw err;
    }
    const filteredProducts: ProductResponse[] = orderDetail.productsOrdered.products.map<ProductResponse>((prod: any) => {
      return {
        quantity: prod.quantity,
        ...prod.productId.toObject(),
      };
    });

    const order: OrderResponse = {
      ...orderDetail.toObject(),
      productsOrdered: { products: filteredProducts, totalPrice: orderDetail.productsOrdered.totalPrice },
    };

    generateInvoicePdf(order, (invoicePath, invoiceName) => {
      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        res.setHeader('Content-Type', 'application/pdf');

        res.status(200).send(data);
      });
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const postReport = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as ExtendedRequest).userId;
  const reportRequest: ReportRequest = { ...req.body, userId };
  try {
    const reportInstance = new Report({ ...reportRequest });
    const response = await reportInstance.save();
    return res.json({ ...response.toObject() });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};
