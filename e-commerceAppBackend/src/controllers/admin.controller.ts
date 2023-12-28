import { NextFunction, Request, Response } from 'express';
import ExtendedRequest, { ProductRequest, StatusError } from '../types';
import { HydratedDocument } from 'mongoose';
import Product from '../models/product.model';
import { Category } from '../models/category.model';
import { ERROR_MESSAGE } from '../common/constants';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { Report } from '../models/report.model';

export const saveNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as ExtendedRequest).userId;
  const productDetail: ProductRequest = req.body;
  const newProduct: HydratedDocument<ProductRequest> = new Product({
    ...productDetail,
    userId,
  });

  try {
    const category = await Category.findById(productDetail.categoryId);
    if (!category) {
      const err = new StatusError(ERROR_MESSAGE.badRequest);
      err.status = 422;
      return next(err);
    }

    const productResponse = await newProduct.save();
    category.products.push(productResponse._id);
    await category.save();

    return res.json({
      ...productResponse.toObject(),
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const saveCategory = async (req: Request, res: Response, next: NextFunction) => {
  const categoryName: string = req.body.categoryName;
  const newCategory = new Category({ name: categoryName, products: [] });

  try {
    const response = await newCategory.save();
    return res.json({
      ...response.toObject(),
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await User.find();
    return res.json({
      ...response,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await Order.find();
    return res.json({
      ...response,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;
  try {
    const productDetails = await Product.findByIdAndUpdate({ _id: productId }, { $set: { isDeleted: true } });
    return res.json({
      ...productDetails,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const editProductById = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.params.productId;
  const productDetail: ProductRequest = req.body;
  try {
    const productDetails = await Product.findByIdAndUpdate({ _id: productId }, { $set: { ...productDetail } });
    return res.json({
      ...productDetails,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const editUserStatusById = async (req: Request, res: Response, next: NextFunction) => {
  const editingUserId = req.params.userId;
  const doDisable: boolean = req.body.isDisable;
  try {
    const userData = await User.findByIdAndUpdate({ _id: editingUserId }, { $set: { isDisable: doDisable } });
    return res.json({
      ...userData?.toObject(),
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allReports = await Report.find();
    return res.json(allReports);
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};
