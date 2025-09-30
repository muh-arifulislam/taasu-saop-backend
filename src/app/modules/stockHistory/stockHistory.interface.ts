import { Types } from 'mongoose';

export interface IStockHistory {
  productId: Types.ObjectId;
  inventoryId: Types.ObjectId;
  change: number;
  reason?: string;

  admin: Types.ObjectId;
}
