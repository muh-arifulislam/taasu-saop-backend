import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IProductInventory } from './productInventory.interface';
import ProductInventory from './productInventory.model';
import { ClientSession, startSession, Types } from 'mongoose';
import { Product } from '../product/product.model';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { StockHistory } from '../stockHistory/stockHistory.model';
import { IStockHistory } from '../stockHistory/stockHistory.interface';

const addOneIntoDB = async (payload: IProductInventory) => {
  const result = await ProductInventory.create(payload);

  return result;
};

const getOneFromDB = async (id: string) => {
  const result = await ProductInventory.findById(id);

  return result;
};

const getManyFromDB = async (query: Record<string, unknown>) => {
  // const result = await ProductInventory.find();

  const builder = new QueryBuilder(ProductInventory.find(), query)
    .paginate()
    .limitFields()
    .sort();

  const products = await builder.build();
  const meta = await builder.getMeta();
  return {
    data: products,
    meta,
  };
};

const updateOneIntoDB = async (
  id: Types.ObjectId,
  payload: Partial<IProductInventory>,
) => {
  const result = await ProductInventory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product inventory not found');
  }

  return result;
};

const updateInventoryOnSale = async (
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

const updateInventoryStock = async (
  id: Types.ObjectId,
  payload: IStockHistory,
) => {
  const session = await startSession();

  session.startTransaction();
  try {
    const inventory = await ProductInventory.findById(id);
    if (!inventory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product inventory not found');
    }

    inventory.quantity += payload.change;
    await inventory.save({ session });
    await StockHistory.create(payload, { session });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const ProductInventoryServices = {
  addOneIntoDB,
  getOneFromDB,
  getManyFromDB,
  updateOneIntoDB,
  updateInventoryOnSale,
  updateInventoryStock,
};
