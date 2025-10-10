import { model, Schema } from 'mongoose';
import { IBlog } from './blog.interface';
import { handleFeatured } from './blog.utils';

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
      type: Schema.Types.Mixed,
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
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware to ensure only MAX_FEATURED blogs are marked as featured
blogSchema.pre('save', async function (next) {
  if (this.featured && this.isModified('featured')) {
    await handleFeatured(this._id);
  }

  next();
});

export const Blog = model<IBlog>('Blog', blogSchema);
