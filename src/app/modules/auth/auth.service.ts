import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import bcrypt from 'bcrypt';

import { UserServices } from '../user/user.service';
import { IUserPayload } from '../user/user.interface';

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

export const AuthServices = {
  loginUser,
  loginWithGoogle,
};
