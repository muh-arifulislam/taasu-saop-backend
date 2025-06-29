import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const addUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const data = await UserServices.addUserIntoDB(userData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: data,
  });
});

const getUser = catchAsync(async (req, res) => {
  const data = await UserServices.getUserFromDB(req.userEmail);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User data retrieved successfully',
    data: data,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.updateUserIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User data updated successfully',
    data: result,
  });
});

const getCustomerUsers = catchAsync(async (req, res) => {
  const { meta, data } = await UserServices.getCustomerUsersFromDB(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Customer data fetch successfully',
    data,
    meta,
  });
});

export const UserControllers = {
  addUser,
  getUser,
  updateUser,
  getCustomerUsers,
};
