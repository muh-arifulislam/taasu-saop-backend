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

const getManyProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getManyProductFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Products data retrieved successful.',
    data: result,
  });
});

export const ProductControllers = {
  createOneProduct,
  getOneProduct,
  getManyProduct,
};
