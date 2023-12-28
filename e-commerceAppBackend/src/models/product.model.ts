import mongoose, { Schema } from 'mongoose';
import { ProductRequest } from '../types';

const productSchema = new Schema<ProductRequest>({
  Mrp_price: { type: Number, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  name: { type: String, required: true },
  noOfItems: { type: Number, required: true },
  price: { type: Number, required: true },
  productImg: [{ type: String, required: true }],
  ratings: { type: Number, required: true },
  review: { type: String, required: true },
  vendorName: { type: String, required: true },
  warrenty: { type: Number, required: true },
  isDeleted :{type:Boolean, required:false, default:false},
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Product = mongoose.model<ProductRequest>('Product', productSchema);

export default Product;
