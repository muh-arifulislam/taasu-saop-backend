import { ProductDiscountServices } from './productDiscount.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

const create = catchAsync(async (req, res) => {
  const result = await ProductDiscountServices.createDiscount(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product discount created successfully',
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const { data, meta } = await ProductDiscountServices.getAllDiscounts(
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product discounts retrieved successfully',
    data: data,
    meta,
  });
});

const getById = catchAsync(async (req, res) => {
  const result = await ProductDiscountServices.getDiscountById(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product discount retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const result = await ProductDiscountServices.updateDiscount(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product discount updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  await ProductDiscountServices.softDeleteDiscount(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product discount soft-deleted successfully',
    data: null,
  });
});

export const ProductDiscountControllers = {
  create,
  getAll,
  getById,
  update,
  remove,
};
