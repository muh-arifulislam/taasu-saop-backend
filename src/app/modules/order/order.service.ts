import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import {
  IOrder,
  IOrderPayload,
  TOrdersQueryParams,
  TStatusHistory,
} from './order.interface';
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
import { generateOrderId } from './order.utils';
import { ProductInventoryServices } from '../productInventory/productInventory.service';

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

    const orderId = await generateOrderId();

    const paymentPayload: IPayment = {
      method: PAYMENT_METHOD.COD,
      status: PAYMENT_STATUS.pending,
      amount: payload.totalAmount,
    };

    const payment = await Payment.create([paymentPayload], {
      session,
    });

    const orderPayload: IOrder = {
      orderId,
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
    const orderId = await generateOrderId();

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
      orderId,
      user: user._id,
      shippingAddress: shippingAddress._id,
      totalAmount: payload.totalAmount,
      payment: payment[0]._id,
      items: payload.items,
      orderStatus: ORDER_STATUS.processing,
      statusHistory,
    };

    const order = await Order.create([orderPayload], { session });

    await Promise.all(
      payload.items.map(async (item) => {
        await ProductInventoryServices.updateOneIntoDB(
          item.product,
          item.quantity,
          { session },
        );
      }),
    );

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

  if (status) {
    const result = await Order.find({
      user: id,
      orderStatus: status,
    });

    return result;
  }

  const result = await Order.find({
    user: id,
  });

  return result;
};

const getOrderFromDB = async (id: string) => {
  const result = await Order.findOne({
    orderId: id,
  })
    .populate('shippingAddress')
    .populate([
      {
        path: 'items.product',
        select: 'images name _id',
      },
      {
        path: 'payment',
      },
      {
        path: 'user',
        populate: {
          path: 'address',
        },
      },
    ]);

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

  const session = await startSession();
  try {
    session.startTransaction();

    const isStatusAlreadyExists = order.statusHistory?.some(
      (status) => status.status === orderStatus,
    );

    // If status is new, proceed to update
    if (orderStatus && !isStatusAlreadyExists) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: id },
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
          runValidators: true,
          new: true,
          session,
        },
      );

      if (!updatedOrder) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'Failed to update order status.',
        );
      }

      // Update inventory only on "Processing"
      if (updatedOrder.orderStatus === 'Processing') {
        await Promise.all(
          updatedOrder.items.map(async (item) => {
            await ProductInventoryServices.updateInventoryOnSale(
              item.product,
              item.quantity,
              { session },
            );
          }),
        );
      }

      await session.commitTransaction(); // ✅ Commit after successful update
      return updatedOrder;
    }

    await session.commitTransaction(); // ✅ Even if status already exists
    return order;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.BAD_REQUEST, err?.message);
  } finally {
    await session.endSession(); // ✅ Always end session
  }
};

const getOrdersFromDB = async (query: TOrdersQueryParams) => {
  const aggregate = Order.aggregate([]);

  //searchTerm
  if (query.searchTerm) {
    const searchRegex = new RegExp(query.searchTerm, 'i');
    aggregate
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userSearch',
      })
      .addFields({
        fullName: {
          $concat: [
            { $ifNull: [{ $arrayElemAt: ['$userSearch.firstName', 0] }, ''] },
            ' ',
            { $ifNull: [{ $arrayElemAt: ['$userSearch.lastName', 0] }, ''] },
          ],
        },
      })
      .match({
        $or: [
          { 'userSearch.email': { $regex: searchRegex } },
          { 'userSearch.firstName': { $regex: searchRegex } },
          { 'userSearch.lastName': { $regex: searchRegex } },
          { fullName: { $regex: searchRegex } },
        ],
      })
      .unwind({ path: '$userSearch', preserveNullAndEmptyArrays: true });
  }

  // filter by status
  if (query.orderStatus) {
    aggregate.match({ orderStatus: query.orderStatus });
  }

  //sorting
  if (query.sortBy && query.sortOrder) {
    aggregate.sort({ [query.sortBy]: query.sortOrder === 'asc' ? 1 : -1 });
  }

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  aggregate.skip(skip).limit(limit);

  //lookup
  aggregate
    .lookup({
      from: 'payments',
      localField: 'payment',
      foreignField: '_id',
      as: 'payment',
    })
    .unwind({ path: '$payment', preserveNullAndEmptyArrays: true })
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    })
    .unwind({ path: '$user', preserveNullAndEmptyArrays: true });

  // Project only firstName and lastName from user
  aggregate.project({
    totalAmount: 1,
    items: 1,
    orderStatus: 1,
    orderId: 1,
    createdAt: 1,
    updatedAt: 1,
    user: {
      firstName: '$user.firstName',
      lastName: '$user.lastName',
      _id: '$user._id',
    },
    payment: {
      status: '$payment.status',
    },
  });

  const result = await aggregate;

  const total = await Order.countDocuments(
    query.orderStatus ? { orderStatus: query.orderStatus } : {},
  );

  const meta = {
    page,
    limit,
    total,
    skip,
  };
  return { meta, data: result };
};

export const OrderServices = {
  addOrderIntoDB,
  geUserOrdersFromDB,
  getOrderFromDB,
  addOrderIntoDBViaStripe,
  updateOrderIntoDB,
  getOrdersFromDB,
};
