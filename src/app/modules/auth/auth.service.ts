import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TChangePasswordPayload, TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import bcrypt from 'bcrypt';

import { UserServices } from '../user/user.service';
import { IUserPayload } from '../user/user.interface';
import { generateHashedPassword } from '../../utils/generateHashedPasswod';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  if (payload.password && user.password) {
    const isPasswordMatched = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched...!');
    }
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { token: accessToken };
};

const loginWithGoogle = async (payload: IUserPayload) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    const { accessToken } = await UserServices.addUserIntoDB(payload);

    return {
      token: accessToken,
    };
  } else {
    //create token and sent to the  client
    const jwtPayload = {
      email: user.email,
      role: user.role,
      id: user._id,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    return {
      token: accessToken,
    };
  }
};

const changeEmailPassword = async (
  userEmail: string,
  payload: TChangePasswordPayload,
) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User not found');
  }

  if (payload.currentPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Both current and new password is same',
    );
  }

  if (user.accountType === 'google') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Can not changed google account password.',
    );
  }
  console.log(user.password);
  const isPasswordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password as string,
  );
  console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched...!');
  }

  const hashedPassword = await generateHashedPassword(payload.newPassword);
  user.password = hashedPassword;
  await user.save();

  return null;
};

export const AuthServices = {
  loginUser,
  loginWithGoogle,
  changeEmailPassword,
};
