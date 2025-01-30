import { model, Schema } from 'mongoose';
import { IOrder, TOrderItem, TStatusHistory } from './order.interface';
import { ORDER_STATUS, OrderStatus } from './order.constant';

const statusHistorySchema = new Schema<TStatusHistory>(
  {
    status: {
      type: String,
      enum: [...OrderStatus],
      default: ORDER_STATUS.pending,
    },
    message: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const orderItemSchema = new Schema<TOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
    },
    price: {
      type: Number,
    },
  },
  {
    versionKey: false,
  },
);

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'ShippingAddress',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    min: 0,
    required: true,
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
  orderStatus: {
    type: String,
    enum: [...OrderStatus],
    default: ORDER_STATUS.pending,
  },
  statusHistory: {
    type: [statusHistorySchema],
    default: () => [
      {
        status: ORDER_STATUS.pending,
        message:
          'Order has been successfully placed. Please! wait for confirmation.',
        timestamp: Date.now(),
      },
    ],
  },
});

export const Order = model<IOrder>('Order', orderSchema);
