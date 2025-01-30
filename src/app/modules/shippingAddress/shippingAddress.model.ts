import { model, Schema } from 'mongoose';
import { IShippingAddress } from './shippingAddress.interface';

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const ShippingAddress = model<IShippingAddress>(
  'ShippingAddress',
  shippingAddressSchema,
);
