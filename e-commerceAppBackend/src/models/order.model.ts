import mongoose, { Schema } from 'mongoose';
import { OrderModel } from '../types';

const orderSchema = new Schema<OrderModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: { type: String, required: true },
    fullName: { type: String, required: true },
    state: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
    productsOrdered: {
      totalPrice: { type: Number, required: true },
      products: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number, required: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model<OrderModel>('Order', orderSchema);
