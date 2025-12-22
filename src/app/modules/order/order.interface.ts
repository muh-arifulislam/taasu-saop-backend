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
  orderId: string;
  user: Types.ObjectId | string;
  items: TOrderItem[];
  totalAmount: number;

  payment_id: Types.ObjectId;
  orderStatus?: TOrderStatus;
  statusHistory?: TStatusHistory[];
  shippingAddress: Types.ObjectId | string;
  isDeleted?: boolean;
}

export interface IOrderPayload extends IOrder {}

export type TOrdersQueryParams = {
  orderStatus?: TOrderStatus;
  user?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  searchTerm?: string;
};
