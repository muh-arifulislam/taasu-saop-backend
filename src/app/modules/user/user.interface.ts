/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUserRole = keyof typeof USER_ROLE;

export interface IUser {
  email: string;
  role: TUserRole;
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<IUser>;
}
