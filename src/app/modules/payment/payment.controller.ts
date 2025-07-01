import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

const getPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payments data fetched successfully',
    data: result,
  });
});

export const PaymentControllers = { getPayments };
