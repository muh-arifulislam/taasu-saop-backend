import { Request } from 'express';
import { Blog } from './blog.model';

const getBlogsFromServer = async (req: Request) => {
  const { searchTerm, category } = req.query;
  const page = Number(req.query?.page) || 1;
  const limit = Number(req.query?.limit) || 9;
  const skip = (page - 1) * limit;
  let query = {};

  if (searchTerm) {
    query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { subTitle: { $regex: searchTerm, $options: 'i' } },
      ],
    };
  }

  if (category?.length) {
    query = {
      category: category,
      ...query,
    };
  }

  const products = await Blog.find(query)
    .skip(skip)
    .limit(Number(limit))
    .populate({
      path: 'user',
      select: {
        _id: true,
        firstName: true,
        lastName: true,
      },
    });

  const total = await Blog.countDocuments(query);

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      skip,
      hasMore: skip + limit < total,
    },
  };
};

const getFeaturedBlogsFromServer = async () => {
  const result = await Blog.find()
    .limit(2)
    .populate({
      path: 'user',
      select: {
        _id: true,
        firstName: true,
        lastName: true,
      },
    });

  return result;
};

const getBlogFromDB = async (id: string) => {
  const result = await Blog.findById(id).populate({
    path: 'user',
    select: {
      _id: true,
      firstName: true,
      lastName: true,
    },
  });

  return result;
};

export const BlogServices = {
  getBlogsFromServer,
  getFeaturedBlogsFromServer,
  getBlogFromDB,
};
