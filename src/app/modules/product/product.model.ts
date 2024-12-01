import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  descriptions: [
    {
      type: String,
      required: true,
    },
  ],
  advantages: [
    {
      type: String,
      required: true,
    },
  ],
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  addInformation: {
    weight: { type: String, required: true },
    dimension: { type: String },
    direction: { type: String },
    warnings: { type: String },
  },
  deletedAt: { type: Date },

  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  },
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: 'ProductInventory',
    required: true,
  },
  discountId: { type: Schema.Types.ObjectId, ref: 'ProductDiscount' },
});

export const Product = model<IProduct>('Product', productSchema);
