import { Schema, model } from 'mongoose';
import { IProductCategory } from './productCategory.interface';

const productCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true },
    description: { type: String },
    deletedAt: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ProductCategory = model<IProductCategory>(
  'ProductCategory',
  productCategorySchema,
);
