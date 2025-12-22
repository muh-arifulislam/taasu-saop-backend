import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createOneProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.addOneProductIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Product created successful.',
    data: result,
  });
});

const getOneProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductServices.getOneProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product data retrieved successful.',
    data: result,
  });
});

const deleteOneById = catchAsync(async (req, res) => {
  const { id } = req.params;

  await ProductServices.deleteOneFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product deleted successful.',
    data: null,
  });
});

const getManyProduct = catchAsync(async (req, res) => {
  const { meta, products } = await ProductServices.getManyProductFromDB(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products data retrieved successful.',
    data: products,
    meta,
  });
});

export const ProductControllers = {
  createOneProduct,
  getOneProduct,
  getManyProduct,
  deleteOneById,
};
