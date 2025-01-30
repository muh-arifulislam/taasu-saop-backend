import { model, Schema } from 'mongoose';
import { IInvoice } from './invoice.interface';

const invoiceSchema = new Schema<IInvoice>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
  },
  {
    versionKey: false,
  },
);

export const Invoice = model<IInvoice>('Invoice', invoiceSchema);
