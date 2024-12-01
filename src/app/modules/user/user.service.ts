import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { createToken } from '../auth/auth.utils';
import config from '../../config';

const addUserIntoDB = async (payload: IUser) => {
  const result = await User.create(payload);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'something going wrong');
  }

  //create token and sent to the  client
  const jwtPayload = {
    email: result.email,
    role: result.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

export const UserServices = { addUserIntoDB };
