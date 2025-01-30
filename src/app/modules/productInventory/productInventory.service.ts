import { IProductInventory } from './productInventory.interface';
import ProductInventory from './productInventory.model';

const addOneIntoDB = async (payload: IProductInventory) => {
  const result = await ProductInventory.create(payload);

  return result;
};

const getOneFromDB = async (id: string) => {
  const result = await ProductInventory.findById(id);

  return result;
};

const getManyFromDB = async () => {
  const result = await ProductInventory.find();

  return result;
};

export const ProductInventoryServices = {
  addOneIntoDB,
  getOneFromDB,
  getManyFromDB,
};
