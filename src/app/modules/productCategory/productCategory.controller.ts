import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductCategoryServices } from './productCategory.service';

const createOneCategory = catchAsync(async (req, res) => {
  const result = await ProductCategoryServices.addOneCategoryIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product category created successful.',
    data: result,
  });
});

const createManyCategory = catchAsync(async (req, res) => {
  const result = await ProductCategoryServices.addManyCategoriesIntoDB(
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product categories created successful.',
    data: result,
  });
});

const getOneCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductCategoryServices.getOneCategoryFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product category data retrieved successful.',
    data: result,
  });
});

const getManyCategories = catchAsync(async (req, res) => {
  const result = await ProductCategoryServices.getManyCategoryFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product categories data retrieved successful.',
    data: result,
  });
});

const getGroupedCategories = catchAsync(async (req, res) => {
  const result = await ProductCategoryServices.getGroupedCategoriesFrom();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Group categories data retrieved successful.',
    data: result,
  });
});

export const ProductCategoryControllers = {
  createOneCategory,
  getOneCategory,
  getManyCategories,
  createManyCategory,
  getGroupedCategories,
};
