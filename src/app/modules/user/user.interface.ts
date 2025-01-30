import { Document, Types } from 'mongoose';

export type TUserRole = 'admin' | 'customer' | 'superAdmin';

export type TAccountType = 'email' | 'google';

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  role: TUserRole;
  accountType: TAccountType;
  googleId?: string;
  mobile: string;
  gender: 'male' | 'female' | 'third';
  address: Types.ObjectId;
}

// User Address Interface
export interface IUserAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}

export interface IUserPayload extends IUser, IUserAddress {}
