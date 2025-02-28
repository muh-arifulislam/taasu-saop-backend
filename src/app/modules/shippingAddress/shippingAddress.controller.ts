import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShippingAddressServices } from './shippingAddress.service';

const addAddress = catchAsync(async (req, res) => {
  const result = await ShippingAddressServices.addAddressIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Shipping address created successful.',
    data: result,
  });
});

const deleteOneAddress = catchAsync(async (req, res) => {
  const { id } = req.params;

  await ShippingAddressServices.deleteOneAddressIntoDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Shipping address deleted successful.',
    data: null,
  });
});

const getManyAddresses = catchAsync(async (req, res) => {
  const result = await ShippingAddressServices.getManyAddressFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Shipping address retrieved successful.',
    data: result,
  });
});

const updateAddress = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShippingAddressServices.updateOneAddressIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Shipping address updated successful.',
    data: result,
  });
});

export const ShippingAddressControllers = {
  addAddress,
  deleteOneAddress,
  getManyAddresses,
  updateAddress,
};
