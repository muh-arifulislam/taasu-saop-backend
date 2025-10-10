import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const getBlogs = catchAsync(async (req, res) => {
  const { data, meta } = await BlogServices.getAllFromDB(req);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Blogs data retrieved successfully.',
    data,
    meta,
  });
});

const getFeaturedBlogs = catchAsync(async (req, res) => {
  const result = await BlogServices.getFeaturedFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Blogs data retrieved successfully.',
    data: result,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.getOneFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Blog data retrieved successfully.',
    data: result,
  });
});

export const BlogControllers = { getBlogs, getFeaturedBlogs, getBlogById };
