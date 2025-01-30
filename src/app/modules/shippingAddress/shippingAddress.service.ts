import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IShippingAddress } from './shippingAddress.interface';
import { ShippingAddress } from './shippingAddress.model';
import { User } from '../user/user.model';

const addAddressIntoDB = async (payload: IShippingAddress) => {
  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found...!');
  }

  const result = await ShippingAddress.create(payload);
  return result;
};

const getOneAddressFromDB = async (id: string) => {
  const result = await ShippingAddress.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Data not found...!');
  }

  return result;
};

const deleteOneAddressIntoDB = async (id: string) => {
  const result = await ShippingAddress.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Data not found...!');
  }

  return null;
};

const updateOneAddressIntoDB = async (
  id: string,
  payload: Partial<IShippingAddress>,
) => {
  const result = await ShippingAddress.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Data not found...!');
  }

  return result;
};

const getManyAddressFromDB = async () => {
  const result = await ShippingAddress.find();
  return result;
};

export const ShippingAddressServices = {
  addAddressIntoDB,
  getOneAddressFromDB,
  getManyAddressFromDB,
  updateOneAddressIntoDB,
  deleteOneAddressIntoDB,
};
