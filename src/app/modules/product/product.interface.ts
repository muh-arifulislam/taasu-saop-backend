import { Schema } from 'mongoose';

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
  deletedAt: Date;

  categoryId: Schema.Types.ObjectId;
  inventoryId: Schema.Types.ObjectId;
  discountId?: Schema.Types.ObjectId;
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

  category: string;
  stock: number;
}
