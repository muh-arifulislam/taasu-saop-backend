import { Document, Types } from 'mongoose';

export interface IInvoice extends Document {
  user: Types.ObjectId;
  order: Types.ObjectId;
  payment: Types.ObjectId;
  notes?: string;
  invoiceNumber: string;
  transactionId?: string;
}
