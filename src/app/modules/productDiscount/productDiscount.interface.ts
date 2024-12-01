export interface IProductDiscount {
  name: string;
  description?: string;
  discountPercent: number;
  isActive: boolean;
  deletedAt?: Date;
}
