import { IProductCategory } from './productCategory.interface';
import { ProductCategory } from './productCategory.model';

const addOneCategoryIntoDB = async (payload: IProductCategory) => {
  const result = await ProductCategory.create(payload);

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

export const ProductCategoryServices = {
  addOneCategoryIntoDB,
  getOneCategoryFromDB,
  getManyCategoryFromDB,
};
