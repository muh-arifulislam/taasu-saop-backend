import { Types } from 'mongoose';
import { IUserAddress } from '../userAddress/userAddress.interface';

// Role & Account Type
export type TUserRole = 'admin' | 'customer' | 'superAdmin' | 'moderator';
export type TAccountType = 'email' | 'google';

// Main User Interface
export interface IUser {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  password?: string | null;
  role: TUserRole;
  accountType: TAccountType;
  googleId?: string | null;
  mobile?: string | null;
  gender?: 'male' | 'female' | 'third' | null;
  isDisabled?: boolean;
  address?: Types.ObjectId;
}

// Payload type that can merge user + address (optional)
export interface IUserPayload extends Partial<IUser>, Partial<IUserAddress> {}

// Query Params
export type TCustomersQueryParams = {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  searchTerm?: string;
};
