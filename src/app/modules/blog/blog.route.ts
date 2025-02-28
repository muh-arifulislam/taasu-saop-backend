import { Router } from 'express';
import { BlogControllers } from './blog.controller';

const router = Router();

router.get('/', BlogControllers.getBlogs);
router.get('/featured', BlogControllers.getFeaturedBlogs);
router.get('/:id', BlogControllers.getBlogById);

export const BlogRoutes = router;
