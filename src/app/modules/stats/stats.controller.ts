import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatsServices } from './stats.service';

const getDashboardStats = catchAsync(async (req, res) => {
  const { data } = await StatsServices.getDashboardStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard stats fetched successful!',
    data,
  });
});

const getKeyMetrics = catchAsync(async (req, res) => {
  const { data } = await StatsServices.getKeyMetricsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Monthly stats fetched successful!',
    data,
  });
});

export const StatsControllers = { getDashboardStats, getKeyMetrics };
