import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';
import {
  PAYMENT_STATUS,
  PaymentMethod,
  PaymentStatus,
} from './payment.constant';

const paymentSchema = new Schema<IPayment>(
  {
    method: {
      type: String,
      enum: [...PaymentMethod],
      required: true,
    },
    status: {
      type: String,
      enum: [...PaymentStatus],
      default: PAYMENT_STATUS.pending,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
