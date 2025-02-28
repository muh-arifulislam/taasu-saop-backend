import { Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  subtitle: string;
  summary: string;
  category: string;
  featuredImage: string;
  mainContent: string;
  user: Types.ObjectId;
  comments: string[];
  tags: string[];
}
