import ProductDiscount from './productDiscount.model';
import { FilterOptions, IProductDiscount } from './productDiscount.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createDiscount = async (data: IProductDiscount) => {
  return await ProductDiscount.create(data);
};

const getAllDiscounts = async (query: FilterOptions) => {
  const filter: Record<string, unknown> = { deletedAt: { $exists: false } };
  // Filter by status
  if (query.status === 'active') {
    filter.isActive = true;
  } else if (query.status === 'inactive') {
    filter.isActive = false;
  }

  // Filter by discount range
  if (query.discountRange === 'low') {
    filter.discountPercent = { $lte: 10 };
  } else if (query.discountRange === 'medium') {
    filter.discountPercent = { $gte: 11, $lte: 30 };
  } else if (query.discountRange === 'high') {
    filter.discountPercent = { $gt: 30 };
  }

  const queryBuilder = new QueryBuilder(
    ProductDiscount.find(filter).lean(),
    query,
  )
    .search(['name'])
    .sort()
    .paginate();

  const data = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data,
    meta,
  };
};

const getDiscountById = async (id: string) => {
  return await ProductDiscount.findOne({
    _id: id,
    deletedAt: { $exists: false },
  });
};

const updateDiscount = async (id: string, data: Partial<IProductDiscount>) => {
  return await ProductDiscount.findOneAndUpdate(
    { _id: id, deletedAt: { $exists: false } },
    data,
    { new: true },
  );
};

const softDeleteDiscount = async (id: string) => {
  return await ProductDiscount.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true },
  );
};

export const ProductDiscountServices = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  softDeleteDiscount,
};
