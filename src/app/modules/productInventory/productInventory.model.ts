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

productInventorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'inventoryId',
  justOne: true,
});

productInventorySchema.set('toJSON', { virtuals: true });

productInventorySchema.set('toObject', { virtuals: true });

const ProductInventory = model<IProductInventory>(
  'ProductInventory',
  productInventorySchema,
);

export default ProductInventory;
