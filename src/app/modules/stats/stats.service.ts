import { growthRate } from '../../utils/stats';
import { Order } from '../order/order.model';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

const getReviewTrend = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const revenueData = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        createdAt: { $gte: sixMonthsAgo, $lte: now },
      },
    },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        total: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const results: { month: string; revenue: number }[] = [];

  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const found = revenueData.find(
      (d) => d._id.year === year && d._id.month === month,
    );

    const monthShort = date.toLocaleString('default', { month: 'short' });

    results.unshift({
      month: monthShort,
      revenue: found?.total || 0,
    });
  }

  return results;
};

const getDashboardStatsFromDB = async () => {
  const [reviewTrend, topProducts] = await Promise.all([
    getReviewTrend(),
    Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
    ]),
  ]);

  return {
    data: {
      reviewTrend,
      topProducts,
    },
  };
};

const getKeyMetricsFromDB = async () => {
  const now = new Date();

  // 1️⃣ Last Month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // 2️⃣ Previous Month
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);

  const [
    // Revenue
    lastMonthRevenueAgg,
    prevMonthRevenueAgg,

    // Orders
    lastMonthOrders,
    prevMonthOrders,

    // Customers
    lastMonthCustomers,
    prevMonthCustomers,

    // Total Products
    totalProducts,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    Order.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    }),
    Order.countDocuments({
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    }),

    User.countDocuments({
      role: 'customer',
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    }),
    User.countDocuments({
      role: 'customer',
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    }),

    Product.countDocuments(),
  ]);

  const lastRevenue = lastMonthRevenueAgg[0]?.total || 0;
  const prevRevenue = prevMonthRevenueAgg[0]?.total || 0;

  return {
    data: {
      revenue: {
        amount: lastRevenue,
        growth: growthRate(lastRevenue, prevRevenue),
      },
      orders: {
        count: lastMonthOrders,
        growth: growthRate(lastMonthOrders, prevMonthOrders),
      },
      customers: {
        count: lastMonthCustomers,
        growth: growthRate(lastMonthCustomers, prevMonthCustomers),
      },
      products: {
        total: totalProducts,
      },
      period: {
        from: lastMonthStart,
        to: lastMonthEnd,
      },
    },
  };
};

export const StatsServices = { getDashboardStatsFromDB, getKeyMetricsFromDB };
