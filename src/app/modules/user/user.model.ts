import { model, Schema } from 'mongoose';
import { IUser, IUserAddress } from './user.interface';
import { AccountType, UserRole } from './user.constant';

const userAddressSchema = new Schema<IUserAddress>(
  {
    addressLine1: {
      type: String,
      default: null,
    },
    addressLine2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    postalCode: {
      type: String,
      default: null,
    },
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

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: [...UserRole],
      required: true,
    },
    accountType: {
      type: String,
      enum: [...AccountType],
      required: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'third'],
      default: null,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'UserAddress',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const User = model<IUser>('User', userSchema);
