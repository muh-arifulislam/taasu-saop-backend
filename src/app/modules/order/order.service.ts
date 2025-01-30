import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IOrder, IOrderPayload, TStatusHistory } from './order.interface';
import { ShippingAddress } from '../shippingAddress/shippingAddress.model';
import { startSession } from 'mongoose';
import { IPayment } from '../payment/payment.interface';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../payment/payment.constant';
import { Payment } from '../payment/payment.model';
import { Order } from './order.model';
import { ORDER_STATUS } from './order.constant';

const addOrderIntoDB = async (payload: IOrderPayload) => {
  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found...!');
  }

  const shippingAddress = await ShippingAddress.findById(
    payload.shippingAddress,
  );
  if (!shippingAddress) {
    throw new AppError(httpStatus.NOT_FOUND, 'Shipping address not found...!');
  }

  const session = await startSession();

  try {
    session.startTransaction();

    const paymentPayload: IPayment = {
      method: PAYMENT_METHOD.COD,
      status: PAYMENT_STATUS.pending,
      amount: payload.totalAmount,
    };

    const payment = await Payment.create([paymentPayload], {
      session,
    });

    const orderPayload: IOrder = {
      user: user._id,
      shippingAddress: shippingAddress._id,
      totalAmount: payload.totalAmount,
      payment: payment[0]._id,
      items: payload.items,
    };

    const order = await Order.create([orderPayload], { session });

    await session.commitTransaction();
    await session.endSession();

    return {
      order,
    };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      'Something went wrong...!',
    );
  }
};

const addOrderIntoDBViaStripe = async (payload: IOrderPayload) => {
  const user = await User.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found...!');
  }

  const shippingAddress = await ShippingAddress.findById(
    payload.shippingAddress,
  );
  if (!shippingAddress) {
    throw new AppError(httpStatus.NOT_FOUND, 'Shipping address not found...!');
  }

  const session = await startSession();

  try {
    session.startTransaction();

    const paymentPayload: IPayment = {
      method: PAYMENT_METHOD.Stripe,
      status: PAYMENT_STATUS.paid,
      amount: payload.totalAmount,
    };

    const payment = await Payment.create([paymentPayload], {
      session,
    });

    const statusHistory: TStatusHistory[] = [
      {
        status: ORDER_STATUS.pending,
        message:
          'Order has been successfully placed. Please! wait for confirmation.',
        timestamp: new Date(),
      },
      {
        status: ORDER_STATUS.processing,
        message: 'Your order is processing.',
        timestamp: new Date(),
      },
    ];

    const orderPayload: IOrder = {
      user: user._id,
      shippingAddress: shippingAddress._id,
      totalAmount: payload.totalAmount,
      payment: payment[0]._id,
      items: payload.items,
      orderStatus: ORDER_STATUS.processing,
      statusHistory,
    };

    const order = await Order.create([orderPayload], { session });

    await session.commitTransaction();
    await session.endSession();

    return {
      order,
    };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      'Something went wrong...!',
    );
  }
};

const geUserOrdersFromDB = async (id: string) => {
  const result = await Order.find({
    user: id,
  });

  return result;
};

const getOrderFromDB = async (id: string, userId: string) => {
  const result = await Order.findOne({
    _id: id,
    user: userId,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return result;
};

export const OrderServices = {
  addOrderIntoDB,
  geUserOrdersFromDB,
  getOrderFromDB,
  addOrderIntoDBViaStripe,
};
