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

const getManyProductFromDB = async (query: Record<string, unknown>) => {
  const categoryFilter: string[] = [];

  if (query?.categories) {
    const categoryArr = (query.categories as string).split(',');
    if (categoryArr.length > 0) {
      categoryFilter.push(...categoryArr);
    }
  }

  // Sorting
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sort: any = { createdAt: -1 };

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 9;
  const skip = (page - 1) * limit;

  const matchStage =
    categoryFilter.length > 0
      ? { $match: { 'category.name': { $in: categoryFilter } } }
      : null;

  // Build aggregation pipeline up to match stage
  const basePipeline = [
    {
      $lookup: {
        from: 'productinventories',
        localField: 'inventoryId',
        foreignField: '_id',
        as: 'inventory',
      },
    },
    {
      $unwind: {
        path: '$inventory',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'productcategories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: {
        path: '$category',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Only add $match if categoryFilter is not empty
    ...(matchStage ? [matchStage] : []),
  ];

  // Get total count before sorting/pagination
  const countPipeline = [...basePipeline, { $count: 'total' }];
  const countResult = await Product.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  // Add sorting and pagination for actual data
  const pipeline = [
    ...basePipeline,
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ];

  const totalPages = Math.ceil(total / limit);
  const products = await Product.aggregate(pipeline);

  const meta = {
    page,
    limit,
    total,
    skip,
    totalPages,
  };

  return { meta, products };

  // const result = await Product.find().populate('categoryId inventoryId');
  // return result;
};

export const ProductServices = {
  addOneProductIntoDB,
  getOneProductFromDB,
  getManyProductFromDB,
};
