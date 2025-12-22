import { model, Schema } from 'mongoose';
import { IUserAddress } from './userAddress.interface';

// User Address Schema
const userAddressSchema = new Schema<IUserAddress>(
  {
    addressLine1: { type: String, default: null },
    addressLine2: { type: String, default: null },
    city: { type: String, default: null },
    postalCode: { type: String, default: null },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const UserAddress = model<IUserAddress>(
  'UserAddress',
  userAddressSchema,
);
