import { Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  slug: string;
  parent?: string; // Optional for subcategories
  type: 'type' | 'skinType' | 'scent' | 'useCase' | 'feature'; // category group
  isActive: boolean;
  deletedAt?: Date | null; // Soft delete field
}

export interface FilterOptions {
  searchTerm?: string;
  status?: 'active' | 'inactive';
  type?: 'type' | 'skinType' | 'scent' | 'useCase' | 'feature' | 'all';
}
