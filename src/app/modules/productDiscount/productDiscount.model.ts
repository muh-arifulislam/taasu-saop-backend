import { model, Schema } from 'mongoose';
import { IProductDiscount } from './productDiscount.interface';

const productDiscountSchema = new Schema<IProductDiscount>(
  {
    name: { type: String, required: true },
    description: { type: String },
    discountPercent: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
    deletedAt: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const ProductDiscount = model<IProductDiscount>(
  'ProductDiscount',
  productDiscountSchema,
);

export default ProductDiscount;
