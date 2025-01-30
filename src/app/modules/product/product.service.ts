import { startSession } from 'mongoose';
import { ProductCategory } from '../productCategory/productCategory.model';
import ProductInventory from '../productInventory/productInventory.model';
import { IProductPayload } from './product.interface';
import { Product } from './product.model';
import AppError from '../../errors/AppError';
import { IProductCategory } from '../productCategory/productCategory.interface';

const addOneProductIntoDB = async (payload: IProductPayload) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const inventory = await ProductInventory.create(
      [
        {
          quantity: payload.stock,
        },
      ],
      {
        session,
      },
    );

    let category: IProductCategory;

    const checkCategoryOnDB = await ProductCategory.findOne({
      name: payload.category,
    });

    if (!checkCategoryOnDB) {
      const result = await ProductCategory.create(
        [
          {
            name: payload.category,
          },
        ],
        { session },
      );

      category = result[0];
    } else {
      category = checkCategoryOnDB;
    }

    const product = await Product.create(
      [{ ...payload, inventoryId: inventory[0]._id, categoryId: category._id }],
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

const getOneProductFromDB = async (id: string) => {
  const result = await Product.findById(id).populate(
    'inventoryId',
    'quantity sold',
  );

  return result;
};

const getManyProductFromDB = async () => {
  const result = await Product.find();
  return result;
};

export const ProductServices = {
  addOneProductIntoDB,
  getOneProductFromDB,
  getManyProductFromDB,
};
