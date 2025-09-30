import { startSession } from 'mongoose';
import { ProductCategory } from '../productCategory/productCategory.model';
import ProductInventory from '../productInventory/productInventory.model';
import { IProductPayload } from './product.interface';
import { Product } from './product.model';
import AppError from '../../errors/AppError';
import { IProductCategory } from '../productCategory/productCategory.interface';
import { ProductQueryBuilder } from '../../utils/QueryBuilder';

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

// const getManyProductFromDB = async (query: Record<string, unknown>) => {
//   const categoryFilter: string[] = [];

//   if (query?.categories) {
//     const categoryArr = (query.categories as string).split(',');
//     if (categoryArr.length > 0) {
//       categoryFilter.push(...categoryArr);
//     }
//   }

//   // Search
//   const searchTerm = query.searchTerm as string;

//   // Price Filtering
//   const priceFilter = query.priceRange as string;

//   // Stock Filtering
//   const stockStatus = query.stock as string; // "in-stock", "low-stock", "out-of-stock"

//   // Sorting
//   const sortBy = query.sortBy as
//     | 'name-asc'
//     | 'name-desc'
//     | 'price-asc'
//     | 'price-desc'
//     | 'stock-asc'
//     | 'stock-desc';

//   const sort: Record<string, 1 | -1> = {};

//   switch (sortBy) {
//     case 'name-asc':
//       sort.name = 1;
//       break;
//     case 'name-desc':
//       sort.name = -1;
//       break;
//     case 'price-asc':
//       sort.price = 1;
//       break;
//     case 'price-desc':
//       sort.price = -1;
//       break;
//     case 'stock-asc':
//       sort['inventory.quantity'] = 1;
//       break;
//     case 'stock-desc':
//       sort['inventory.quantity'] = -1;
//       break;
//     default:
//       sort.createdAt = -1;
//   }

//   // Pagination
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 9;
//   const skip = (page - 1) * limit;

//   // Build dynamic match stage
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const matchConditions: Record<string, any> = {};

//   // Category filter
//   if (categoryFilter.length > 0) {
//     matchConditions['category.name'] = { $in: categoryFilter };
//   }

//   // Search filter
//   if (searchTerm) {
//     matchConditions.name = { $regex: searchTerm, $options: 'i' };
//   }

//   // Price filter
//   if (priceFilter === '$0-$20') {
//     matchConditions.price = { $gte: 0, $lte: 20 };
//   } else if (priceFilter === '$21-$40') {
//     matchConditions.price = { $gte: 21, $lte: 40 };
//   } else if (priceFilter === '$40') {
//     matchConditions.price = { $gte: 41 };
//   }

//   // Stock filter
//   if (stockStatus === 'in-stock') {
//     matchConditions['inventory.quantity'] = { $gt: 0 };
//   } else if (stockStatus === 'low-stock') {
//     matchConditions['inventory.quantity'] = { $lte: 10, $gt: 0 };
//   } else if (stockStatus === 'out-of-stock') {
//     matchConditions['inventory.quantity'] = 0;
//   }

//   // Match stage
//   const matchStage =
//     Object.keys(matchConditions).length > 0
//       ? { $match: matchConditions }
//       : null;

//   // Aggregation pipeline
//   const basePipeline = [
//     {
//       $lookup: {
//         from: 'productinventories',
//         localField: 'inventoryId',
//         foreignField: '_id',
//         as: 'inventory',
//       },
//     },
//     { $unwind: { path: '$inventory', preserveNullAndEmptyArrays: true } },
//     {
//       $lookup: {
//         from: 'productcategories',
//         localField: 'categoryId',
//         foreignField: '_id',
//         as: 'category',
//       },
//     },
//     { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
//     {
//       $lookup: {
//         from: 'productdiscounts',
//         localField: 'discountId',
//         foreignField: '_id',
//         as: 'discount',
//       },
//     },
//     { $unwind: { path: '$discount', preserveNullAndEmptyArrays: true } },
//     ...(matchStage ? [matchStage] : []),
//   ];

//   // Count before pagination
//   const countPipeline = [...basePipeline, { $count: 'total' }];
//   const countResult = await Product.aggregate(countPipeline);
//   const total = countResult[0]?.total || 0;

//   // Final data pipeline
//   const pipeline = [
//     ...basePipeline,
//     { $sort: sort },
//     { $skip: skip },
//     { $limit: limit },
//   ];

//   const totalPages = Math.ceil(total / limit);
//   const products = await Product.aggregate(pipeline);

//   const meta = {
//     page,
//     limit,
//     total,
//     skip,
//     totalPages,
//   };

//   return { meta, products };
// };

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
};
