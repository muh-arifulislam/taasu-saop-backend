import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  sku: string;
  price: number;
  descriptions: string[];
  advantages: string[];
  ingredients: string[];
  addInformation: {
    weight: string;
    dimension?: string;
    direction?: string;
    warnings?: string;
  };
  images: string[];
  deletedAt: Date;

  categoryId: Types.ObjectId;
  inventoryId: Types.ObjectId;
  discountId?: Types.ObjectId;
}

export interface IProductPayload {
  name: string;
  sku: string;
  price: number;
  descriptions: string[];
  advantages: string[];
  ingredients: string[];
  addInformation: {
    weight: string;
    dimension?: string;
    direction?: string;
    warnings?: string;
  };

  categoryId: string;
  stock: number;
  sold: number;
}
