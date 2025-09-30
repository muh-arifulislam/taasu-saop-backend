import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductInventoryServices } from './productInventory.service';

const createOneInventory = catchAsync(async (req, res) => {
  const result = await ProductInventoryServices.addOneIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Inventory has been created successfully.',
    data: result,
  });
});

const findOneInventory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductInventoryServices.getOneFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Inventory has been retrieved successfully.',
    data: result,
  });
});

const findManyInventory = catchAsync(async (req, res) => {
  const { meta, data } = await ProductInventoryServices.getManyFromDB(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Inventories has been retrieved successfully.',
    data,
    meta,
  });
});

export const ProductInventoryControllers = {
  createOneInventory,
  findOneInventory,
  findManyInventory,
};
