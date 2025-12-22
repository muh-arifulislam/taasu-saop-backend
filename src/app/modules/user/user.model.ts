import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import { AccountType, UserRole } from './user.constant';

// User Schema
const userSchema = new Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    role: { type: String, enum: [...UserRole], required: true },
    accountType: { type: String, enum: [...AccountType], required: true },
    googleId: { type: String, default: null },
    mobile: { type: String, default: null },
    gender: { type: String, enum: ['male', 'female', 'third'], default: null },
    address: { type: Schema.Types.ObjectId, ref: 'UserAddress', default: null },
    isDisabled: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const User = model<IUser>('User', userSchema);
