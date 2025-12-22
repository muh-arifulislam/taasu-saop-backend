import { startSession } from 'mongoose';
import ProductInventory from '../productInventory/productInventory.model';
import { IProductPayload } from './product.interface';
import { Product } from './product.model';
import AppError from '../../errors/AppError';
import { ProductQueryBuilder } from '../../utils/QueryBuilder';
import httpStatus from 'http-status';

const addOneProductIntoDB = async (payload: IProductPayload) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const inventory = await ProductInventory.create(
      [
        {
          quantity: payload.stock,
          sold: payload.sold,
        },
      ],
      {
        session,
      },
    );

    const product = await Product.create(
      [
        {
          ...payload,
          inventoryId: inventory[0]._id,
          categoryId: payload.categoryId,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return {
      product,
      inventory,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err?.message);
  }
};

const deleteOneFromDB = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  const session = await startSession();

  try {
    session.startTransaction();

    await ProductInventory.findByIdAndDelete(product.inventoryId, { session });
    await Product.deleteOne({ _id: id }, { session });

    await session.commitTransaction();
    await session.endSession();

    return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err?.message);
  }
};

const getOneProductFromDB = async (id: string) => {
  const result = await Product.findById(id).populate(
    'inventoryId',
    'quantity sold',
  );

  return result;
};

const getManyProductFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new ProductQueryBuilder(
    Product.find().populate('inventory').lean(),
    query,
  )
    .limitFields()
    .search(['name'])
    .filterByPriceRange()
    .filterByStockStatus()
    .sort()
    .paginate();

  const products = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { products, meta };
};

export const ProductServices = {
  addOneProductIntoDB,
  getOneProductFromDB,
  getManyProductFromDB,
  deleteOneFromDB,
};
