import { Request } from 'express';
import { Blog } from './blog.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const getBlogsFromServer = async (req: Request) => {
  const query = new QueryBuilder(Blog.find(), req.query).sort().paginate();

  const data = await query.build();

  const meta = await query.getMeta();

  return {
    meta,
    data,
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
