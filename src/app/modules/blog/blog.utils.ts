import { Blog } from './blog.model';
import { Types, ClientSession, startSession } from 'mongoose';

const MAX_FEATURED = 3;

export async function handleFeatured(blogId: Types.ObjectId | string) {
  const session: ClientSession = await startSession();
  session.startTransaction();

  try {
    const featuredCount = await Blog.countDocuments({
      featured: true,
      _id: { $ne: blogId },
    }).session(session);

    if (featuredCount >= MAX_FEATURED) {
      const oldestFeatured = await Blog.findOne({
        featured: true,
        _id: { $ne: blogId },
      })
        .sort({ updatedAt: 1 })
        .session(session);

      if (oldestFeatured) {
        oldestFeatured.featured = false;
        await oldestFeatured.save({ session });
      }
    }
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
