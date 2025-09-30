import { QueryBuilder } from '../../utils/QueryBuilder';
import { IProductCategory } from './productCategory.interface';
import { ProductCategory } from './productCategory.model';

const addOneCategoryIntoDB = async (payload: IProductCategory) => {
  const result = await ProductCategory.create(payload);

  return result;
};

const addManyCategoriesIntoDB = async (categories: IProductCategory[]) => {
  const result = await ProductCategory.insertMany(categories, {
    ordered: false,
  });

  return result;
};

const getOneCategoryFromDB = async (id: string) => {
  const result = await ProductCategory.findById(id);

  return result;
};

const getManyCategoryFromDB = async (query) => {
  const queryBuilder = new QueryBuilder(
    ProductCategory.find({
      deletedAt: { $eq: null },
    }),
    query,
  )
    .limitFields()
    .search(['name'])
    .filter()
    .sort()
    .paginate();

  const data = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data, meta };

  // const filter: Record<string, unknown> = {
  //   deletedAt: null,
  // };

  // if (query.searchTerm?.trim()) {
  //   const regex = new RegExp(query.searchTerm, 'i');
  //   filter.$or = [{ name: regex }, { description: regex }];
  // }

  // // Filter by status
  // if (query.status === 'active') {
  //   filter.isActive = true;
  // } else if (query.status === 'inactive') {
  //   filter.isActive = false;
  // }

  // // Filter by category type
  // if (query.type && query.type !== 'all') {
  //   filter.type = query.type;
  // }

  // // Fetch and return filtered data
  // return await ProductCategory.find(filter).sort({
  //   createdAt: -1,
  // });
};

const getGroupedCategoriesFrom = async () => {
  const categories = await ProductCategory.find({
    isActive: true,
    deletedAt: { $exists: false },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = categories.reduce((acc: any, cat) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push(cat);
    return acc;
  }, {});

  return grouped;
};

const updateOneIntoDB = async (
  id: string,
  payload: Partial<IProductCategory>,
) => {
  return await ProductCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const softDeleteCategory = async (id: string) => {
  return await ProductCategory.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true },
  );
};

export const ProductCategoryServices = {
  addOneCategoryIntoDB,
  getOneCategoryFromDB,
  getManyCategoryFromDB,
  addManyCategoriesIntoDB,
  getGroupedCategoriesFrom,
  updateOneIntoDB,
  softDeleteCategory,
};
