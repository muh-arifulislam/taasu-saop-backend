import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const placeOrderViaCOD = catchAsync(async (req, res) => {
  const result = await OrderServices.addOrderIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order successfully placed',
    data: result,
  });
});

const placeOrderViaStripe = catchAsync(async (req, res) => {
  const result = await OrderServices.addOrderIntoDBViaStripe(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order successfully placed',
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.geUserOrdersFromDB(req.user.id, req);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order data retrieved successful.',
    data: result,
  });
});

const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderServices.getOrderFromDB(id, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order data retrieved successful.',
    data: result,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OrderServices.updateOrderIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order data updated successful.',
    data: result,
  });
});

export const OrderControllers = {
  placeOrderViaCOD,
  placeOrderViaStripe,
  getUserOrders,
  getOrder,
  updateOrder,
};
