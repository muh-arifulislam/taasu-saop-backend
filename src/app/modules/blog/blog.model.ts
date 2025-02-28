import { model, Schema } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    summary: {
      type: String,
    },
    category: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    mainContent: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Blog = model<IBlog>('Blog', blogSchema);
