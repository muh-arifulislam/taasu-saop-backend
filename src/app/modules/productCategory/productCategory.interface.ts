import { Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  description?: string;
  deletedAt?: Date;
}
