import { Schema, model } from 'mongoose';
import { IProductCategory } from './productCategory.interface';

const productCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parent: { type: String, default: null },
    type: {
      type: String,
      enum: ['type', 'skinType', 'scent', 'useCase', 'feature'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ProductCategory = model<IProductCategory>(
  'ProductCategory',
  productCategorySchema,
);
