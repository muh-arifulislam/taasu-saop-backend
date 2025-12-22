import { Types } from 'mongoose';

export interface IShippingAddress {
  fullName: string;
  mobile: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode?: string;
  user: Types.ObjectId;
}
