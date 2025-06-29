import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const { method } = req.query;

  let result;
  if (method === 'google') {
    result = await AuthServices.loginWithGoogle(req.body);
  } else {
    result = await AuthServices.loginUser(req.body);
  }

  const { token } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successful!',
    data: {
      accessToken: token,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  await AuthServices.changeEmailPassword(req.userEmail, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is changed successful!',
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
