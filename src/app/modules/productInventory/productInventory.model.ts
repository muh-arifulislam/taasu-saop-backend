import { model, Schema } from 'mongoose';
import { IProductInventory } from './productInventory.interface';

const productInventorySchema = new Schema<IProductInventory>(
  {
    quantity: { type: Number, required: true },
    sold: {
      type: Number,
    },
    deletedAt: { type: Date },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const ProductInventory = model<IProductInventory>(
  'ProductInventory',
  productInventorySchema,
);

export default ProductInventory;
