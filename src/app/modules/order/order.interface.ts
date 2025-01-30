import { Types } from 'mongoose';
import { OrderStatus } from './order.constant';

export type TOrderItem = {
  product: Types.ObjectId;
  quantity: number;
  price: number;
};

export type TOrderStatus = (typeof OrderStatus)[number];

export type TStatusHistory = {
  status: TOrderStatus;
  message?: string;
  timestamp: Date;
};

export interface IOrder {
  user: Types.ObjectId;
  items: TOrderItem[];
  totalAmount: number;
  shippingAddress: Types.ObjectId;
  payment: Types.ObjectId;
  orderStatus?: TOrderStatus;
  statusHistory?: TStatusHistory[];

  isDeleted?: boolean;
}

export interface IOrderPayload extends IOrder {
  user: Types.ObjectId;
  items: TOrderItem[];
  totalAmount: number;
  shippingAddress: Types.ObjectId;
  payment: Types.ObjectId;
  orderStatus: TOrderStatus;
  statusHistory: TStatusHistory[];
}
