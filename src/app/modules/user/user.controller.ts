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

export const UserControllers = { addUser };
