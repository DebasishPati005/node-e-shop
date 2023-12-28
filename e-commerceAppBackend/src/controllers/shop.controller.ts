import { NextFunction, Request, Response } from 'express';
import Product from '../models/product.model';
import ProductRequest from '../models/product.model';
import { StatusError } from '../types';
import { CONSTANTS, ERROR_MESSAGE } from '../common/constants';
import { Category } from '../models/category.model';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const pageNumber = req.query.page || CONSTANTS.DEFAULT_PAGE;
  const selectedPrPage = req.query.perPage || CONSTANTS.ITEMS_PER_PAGE;
  try {
    const totalDocuments = await Product.find({ isDeleted: { $ne: true } }).countDocuments();
    const allProducts = await Product.find({ isDeleted: { $ne: true } })
      .skip((+pageNumber - 1) * +selectedPrPage)
      .limit(+selectedPrPage);

    return res.json({
      products: allProducts,
      totalProducts: totalDocuments,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.query.categoryId;
  const pageNumber = req.query.page || CONSTANTS.DEFAULT_PAGE;
  const selectedPrPage = req.query.perPage ?? CONSTANTS.ITEMS_PER_PAGE;

  try {
    const totalProducts = await Product.find({ categoryId: categoryId ?? '' }).countDocuments();
    const allProducts = await Product.find({ categoryId: categoryId })
      .skip((+pageNumber - 1) * +selectedPrPage)
      .limit(+selectedPrPage);

    return res.json({
      products: allProducts,
      totalProducts,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();

    return res.json({
      result: categories,
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: string = req.params.productId;
    const productDetail = await ProductRequest.findById(productId);
    return res.json({
      ...productDetail?.toObject(),
    });
  } catch {
    const err = new StatusError(ERROR_MESSAGE.default);
    err.status = 500;
    next(err);
  }
};
