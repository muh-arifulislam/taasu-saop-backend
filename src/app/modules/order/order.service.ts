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
import { ORDER_STATUS, ORDER_STATUS_MESSAGES } from './order.constant';
import { Request } from 'express';
import Stripe from 'stripe';
import config from '../../config';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.FAILED_DEPENDENCY,
      err?.message ?? 'Something went wrong...!',
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

    const stripe = new Stripe(config.stripe_secret as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: payload.totalAmount * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      payment_method: 'pm_card_visa',
    });

    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
    );

    if (confirmedPaymentIntent.status !== 'succeeded') {
      throw new AppError(400, 'Failed to payment into stripe');
    }

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

const geUserOrdersFromDB = async (id: string, req: Request) => {
  const { status } = req.query;
  const result = await Order.find({
    user: id,
    orderStatus: status,
  });

  return result;
};

const getOrderFromDB = async (id: string, userId: string) => {
  const result = await Order.findOne({
    _id: id,
    user: userId,
  }).populate('shippingAddress');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return result;
};

const updateOrderIntoDB = async (id: string, payload: Partial<IOrder>) => {
  const { orderStatus } = payload;

  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order has not found.');
  }

  const isStatusAlreadyExists = order.statusHistory?.some((status) => {
    if (status.status === orderStatus) {
      return true;
    }
  });

  if (orderStatus && !isStatusAlreadyExists) {
    const updatedOrder = await order.updateOne(
      {
        $set: {
          orderStatus: orderStatus,
        },
        $addToSet: {
          statusHistory: {
            status: orderStatus,
            message: ORDER_STATUS_MESSAGES[orderStatus],
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return updatedOrder;
  }

  return order;
};

export const OrderServices = {
  addOrderIntoDB,
  geUserOrdersFromDB,
  getOrderFromDB,
  addOrderIntoDBViaStripe,
  updateOrderIntoDB,
};
