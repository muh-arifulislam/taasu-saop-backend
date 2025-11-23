import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
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

const getManyCategoryFromDB = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(ProductCategory.find(), query)
    .limitFields()
    .search(['name'])
    .filter()
    .sort()
    .paginate();

  const data = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return { data, meta };
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

const deleteCategory = async (id: string) => {
  const category = await ProductCategory.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!!!');
  }
  if (category.slug === 'unknown') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This category can not be delete!!!',
    );
  }

  return await ProductCategory.deleteOne({ _id: id });
};

export const ProductCategoryServices = {
  addOneCategoryIntoDB,
  getOneCategoryFromDB,
  getManyCategoryFromDB,
  addManyCategoriesIntoDB,
  getGroupedCategoriesFrom,
  updateOneIntoDB,
  deleteCategory,
};
