import { Types } from 'mongoose';
import { Request } from 'express';

export interface ProductRequest {
  Mrp_price: number;
  categoryId: Types.ObjectId;
  description: string;
  name: string;
  noOfItems: number;
  price: number;
  productImg: string[];
  ratings: number;
  review: string;
  vendorName: string;
  warrenty: number;
  isDeleted: false;
  userId: Types.ObjectId;
}

export interface ProductResponse extends ProductRequest {
  _id: string;
  quantity: number;
}

export interface UserRequest {
  name: string;
  role: string;
  email: string;
  password: string;
  isDisable?: boolean;
  resetTokenExpires?: Date;
  resetToken?: string;
  productsInWishList: Types.ObjectId[];
  productsInCart: ICartDetail;
}

export interface ICartDetail {
  totalPrice: number;
  products: { productId: string; quantity: number }[];
}

export interface OrderedProductResponse {
  totalPrice: number;
  products: ProductResponse[];
}

export interface CategoryRequest {
  name: string;
  products: Types.ObjectId[];
}

export interface BlacklistJWTRequest {
  userId: Types.ObjectId;
  token: string;
}

export class StatusError extends Error {
  status: number | undefined;
}

export default interface ExtendedRequest extends Request {
  userId?: string;
  role: 'admin' | 'user';
  token?: string;
}

export interface UserAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: number;
}
export interface OrderRequest extends UserAddress {
  productsOrdered: ICartDetail;
}

export interface OrderModel extends OrderRequest {
  userId: Types.ObjectId;
}

export interface OrderResponse extends UserAddress {
  _id: string;
  productsOrdered: OrderedProductResponse;
  userId: Types.ObjectId;
  createdAt: string;
}

export interface MailConfig {
  to: string;
  subject: string;
  html: string;
}

export type MailResponse = {
  message: string;
  sentMail: boolean;
};

export interface ReportRequest {
  firstName: string;
  lastName: string;
  mail: string;
  mobile: string;
  suggestion: string;
  userId: Types.ObjectId;
}
