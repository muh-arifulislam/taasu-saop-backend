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

const deleteBlogById = catchAsync(async (req, res) => {
  const result = await BlogServices.deleteOneFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Blog data deleted successfully.',
    data: result,
  });
});

const updateBlogById = catchAsync(async (req, res) => {
  const result = await BlogServices.updateOneIntoDB(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Blog data updated successfully.',
    data: result,
  });
});

const createBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.createOneIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Blog data created successfully.',
    data: result,
  });
});

export const BlogControllers = {
  getBlogs,
  getFeaturedBlogs,
  getBlogById,
  deleteBlogById,
  updateBlogById,
  createBlog,
};
