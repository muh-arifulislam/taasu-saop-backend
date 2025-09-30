import { model, Schema } from 'mongoose';
import { IStockHistory } from './stockHistory.interface';

const stockHistorySchema = new Schema<IStockHistory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
    },
    change: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const StockHistory = model<IStockHistory>(
  'StockHistory',
  stockHistorySchema,
);
