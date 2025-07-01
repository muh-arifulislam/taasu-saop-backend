import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IProductInventory } from './productInventory.interface';
import ProductInventory from './productInventory.model';
import { ClientSession, Types } from 'mongoose';
import { Product } from '../product/product.model';

const addOneIntoDB = async (payload: IProductInventory) => {
  const result = await ProductInventory.create(payload);

  return result;
};

const getOneFromDB = async (id: string) => {
  const result = await ProductInventory.findById(id);

  return result;
};

const getManyFromDB = async () => {
  const result = await ProductInventory.find();

  return result;
};

const updateOneIntoDB = async (
  id: Types.ObjectId,
  quantity: number,
  options: {
    session: ClientSession;
  },
) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const inventory = await ProductInventory.findById(product?.inventoryId);

  if (!inventory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product inventory not found');
  }

  if (inventory.quantity < quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Insufficient inventory quantity',
    );
  }
  inventory.quantity -= quantity;
  inventory.sold = (inventory.sold || 0) + quantity;
  await inventory.save({ session: options?.session });

  return inventory;
};

export const ProductInventoryServices = {
  addOneIntoDB,
  getOneFromDB,
  getManyFromDB,
  updateOneIntoDB,
};
