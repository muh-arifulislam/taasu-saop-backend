import { Types } from 'mongoose';
import { PaymentMethod, PaymentStatus } from './payment.constant';

export interface IPayment {
  method: (typeof PaymentMethod)[number];
  status: (typeof PaymentStatus)[number];
  amount: number;
  invoice?: Types.ObjectId;
}
