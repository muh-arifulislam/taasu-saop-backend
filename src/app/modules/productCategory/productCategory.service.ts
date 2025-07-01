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

const getManyCategoryFromDB = async () => {
  const result = await ProductCategory.find();

  return result;
};

const getGroupedCategoriesFrom = async () => {
  const categories = await ProductCategory.find({ isActive: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = categories.reduce((acc: any, cat) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push(cat);
    return acc;
  }, {});

  return grouped;
};

export const ProductCategoryServices = {
  addOneCategoryIntoDB,
  getOneCategoryFromDB,
  getManyCategoryFromDB,
  addManyCategoriesIntoDB,
  getGroupedCategoriesFrom,
};
