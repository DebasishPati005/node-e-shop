import mongoose, { Schema } from 'mongoose';
import { CategoryRequest } from '../types';

const categorySchema = new Schema<CategoryRequest>({
  name: { type: String, required: true },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
});

export const Category = mongoose.model<CategoryRequest>('Category', categorySchema);
