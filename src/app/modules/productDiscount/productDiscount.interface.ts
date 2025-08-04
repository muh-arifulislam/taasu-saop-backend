export interface IProductDiscount {
  name: string;
  description?: string;
  discountPercent: number;
  isActive: boolean;
  deletedAt?: Date;
}

export type DiscountRange = 'all' | 'low' | 'medium' | 'high';
export type DiscountStatus = 'all' | 'active' | 'inactive';

export interface FilterOptions {
  searchTerm?: string;
  status?: DiscountStatus;
  discountRange?: DiscountRange;
}
