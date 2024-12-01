import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: [USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin],
      default: USER_ROLE.user,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

export const User = model<IUser, UserModel>('User', userSchema);
