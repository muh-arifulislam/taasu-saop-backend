import { Request } from 'express';
import { Blog } from './blog.model';
import { QueryBuilder } from '../../utils/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IBlog } from './blog.interface';

const getAllFromDB = async (req: Request) => {
  const query = new QueryBuilder(
    Blog.find().populate('user', 'firstName lastName'),
    req.query,
  )
    .sort()
    .paginate();
  const data = await query.build();
  const meta = await query.getMeta();

  return {
    meta,
    data,
  };
};

const getFeaturedFromDB = async () => {
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

const getOneFromDB = async (id: string) => {
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

const deleteOneFromDB = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found!.');
  }

  return null;
};

const updateOneIntoDB = async (id: string, payload: Partial<IBlog>) => {
  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const createOneIntoDB = async (payload: IBlog) => {
  const result = await Blog.create(payload);

  return result;
};

export const BlogServices = {
  getAllFromDB,
  getFeaturedFromDB,
  getOneFromDB,
  deleteOneFromDB,
  updateOneIntoDB,
  createOneIntoDB,
};
