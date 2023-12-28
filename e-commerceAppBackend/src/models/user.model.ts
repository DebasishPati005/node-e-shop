import mongoose, { Schema } from 'mongoose';
import { UserRequest } from '../types';

const userSchema = new Schema<UserRequest>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' },
  password: { type: String, required: true },
  resetToken: { type: String },
  isDisable: { type: Boolean, default: false },
  resetTokenExpires: { type: Date },
  productsInCart: {
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
  productsInWishList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
});

export const User = mongoose.model<UserRequest>('User', userSchema);
