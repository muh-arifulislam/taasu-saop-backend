import { Router } from 'express';
import { BlogControllers } from './blog.controller';

const router = Router();

router.get('/featured', BlogControllers.getFeaturedBlogs);

router.delete('/:id', BlogControllers.deleteBlogById);

router.patch('/:id', BlogControllers.updateBlogById);

router.get('/:id', BlogControllers.getBlogById);

router.get('/', BlogControllers.getBlogs);

router.post('/', BlogControllers.createBlog);

export const BlogRoutes = router;
