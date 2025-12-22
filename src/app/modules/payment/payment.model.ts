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
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual to get related order
paymentSchema.virtual('order', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'payment_id',
  justOne: true,
  options: { select: 'orderId -_id -payment_id' },
});

export const Payment = model<IPayment>('Payment', paymentSchema);
