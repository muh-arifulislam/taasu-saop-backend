import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser, IUserAddress, IUserPayload } from './user.interface';
import { User, UserAddress } from './user.model';
import { createToken } from '../auth/auth.utils';
import config from '../../config';
import { generateHashedPassword } from '../../utils/generateHashedPasswod';
import { startSession } from 'mongoose';

const addUserIntoDB = async (payload: IUserPayload) => {
  const { addressLine1, city, postalCode, password, ...userPayload } = payload;

  const session = await startSession();

  try {
    session.startTransaction();

    //hashed password
    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await generateHashedPassword(password);
    }

    //create User Address
    const addressPayload: IUserAddress = {
      addressLine1: addressLine1 ?? null,
      city: city ?? null,
      postalCode: postalCode ?? null,
    };
    const address = await UserAddress.create([addressPayload], { session });

    //create user
    const result = await User.create(
      [
        {
          ...userPayload,
          password: hashedPassword,
          address: address[0]._id,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, 'something going wrong');
    }

    //create token and sent to the  client
    const jwtPayload = {
      email: result[0].email,
      role: result[0].role,
      id: result[0]._id,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    await session.commitTransaction();
    await session.endSession();

    return { accessToken };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  }
};

const getUserFromDB = async (email: string) => {
  const query = User.aggregate([
    {
      $match: {
        email,
      },
    },
    {
      $lookup: {
        from: 'useraddresses', // Ensure this matches the actual collection name
        localField: 'address', // Field in the User collection
        foreignField: '_id', // Field in the UserAddress collection
        as: 'userAddress', // Alias for the joined data
      },
    },
    {
      $unwind: {
        path: '$userAddress', // Unwind the array to get a single object
        preserveNullAndEmptyArrays: true, // Allow users without an address
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        mobile: 1,
        email: 1,
        addressLine1: '$userAddress.addressLine1',
        city: '$userAddress.city',
        postalCode: '$userAddress.postalCode',
      },
    },
  ]);

  const result = await query;

  return result[0];
};

const updateUserIntoDB = async (
  id: string,
  payload: Partial<IUser & IUserAddress>,
) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }

  const session = await startSession();
  try {
    session.startTransaction();

    const addressPayload = {
      addressLine1: payload.addressLine1,
      city: payload.city,
      postalCode: payload.postalCode,
    };
    await UserAddress.findByIdAndUpdate(user.address, addressPayload, {
      upsert: true,
      runValidators: true,
      new: true,
      session,
    });

    const userPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      mobile: payload.mobile,
    };
    const result = await User.findByIdAndUpdate(id, userPayload, {
      session,
      runValidators: true,
      new: true,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err?.message);
  }
};

export const UserServices = { addUserIntoDB, getUserFromDB, updateUserIntoDB };
