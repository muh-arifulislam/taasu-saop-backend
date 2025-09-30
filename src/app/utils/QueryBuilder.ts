import { Query } from 'mongoose';
import { IProduct } from '../modules/product/product.interface';

interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
  fields?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ProductQueryParams extends QueryParams {
  minPrice?: string;
  maxPrice?: string;
  stockStatus?: string;
}

export class QueryBuilder<T> {
  protected query: Query<T[], T>;
  protected queryParams: QueryParams;

  constructor(query: Query<T[], T>, queryParams: QueryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  // 1. Filtering
  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Convert operators like price[gte]=10 into { price: { $gte: 10 } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  // 2. Search (basic: one field, can extend for multiple)
  search(fields: string[]) {
    if (this.queryParams.search) {
      const searchRegex = {
        $or: fields.map((field) => ({
          [field]: { $regex: this.queryParams.search, $options: 'i' },
        })),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.query = this.query.find(searchRegex as any);
    }
    return this;
  }

  // 3. Sorting
  sort() {
    const sortBy = this.queryParams.sort?.split('-')[0];
    const sortOrder = this.queryParams.sort?.split('-')[1] === 'desc' ? -1 : 1;

    if (this.queryParams.sort && sortBy) {
      this.query = this.query.sort({ [sortBy]: sortOrder });
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // 4. Field limiting
  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // 5. Pagination
  private getPaginationParams() {
    const page = parseInt(this.queryParams.page as string) || 1;
    const limit = parseInt(this.queryParams.limit as string) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }
  paginate() {
    const { skip, limit } = this.getPaginationParams();
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  async getMeta() {
    const { page, limit, skip } = this.getPaginationParams();
    const total = await this.query.model.countDocuments(this.query.getQuery());
    const totalPages = Math.ceil(total / limit);
    return { total, page, limit, skip, totalPages };
  }

  build() {
    return this.query;
  }
}

export class ProductQueryBuilder extends QueryBuilder<IProduct> {
  protected queryParams: ProductQueryParams;

  constructor(
    query: Query<IProduct[], IProduct>,
    queryParams: ProductQueryParams,
  ) {
    super(query, queryParams);
    this.queryParams = queryParams;
  }

  filterByPriceRange() {
    const minPrice = this.queryParams.minPrice
      ? Number(this.queryParams.minPrice)
      : 0;
    const maxPrice = this.queryParams.maxPrice
      ? Number(this.queryParams.maxPrice)
      : Infinity;

    if (minPrice || maxPrice) {
      this.query = this.query.find({
        price: { $gte: minPrice, $lte: maxPrice },
      });
    }

    return this;
  }

  filterByStockStatus() {
    const stockStatus = this.queryParams.stockStatus;

    if (stockStatus === 'in-stock') {
      this.query = this.query.find().populate({
        path: 'inventoryId',
        match: { quantity: { $gt: 0 } },
        select: 'quantity',
      });
    } else if (stockStatus === 'low-stock') {
      this.query = this.query.find().populate({
        path: 'inventoryId',
        match: { quantity: { $lte: 10, $gt: 0 } },
        select: 'quantity',
      });
    } else if (stockStatus === 'out-of-stock') {
      this.query = this.query.find().populate({
        path: 'inventoryId',
        match: { quantity: 0 },
        select: 'quantity',
      });
    }

    return this;
  }
}
