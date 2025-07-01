import { Router } from 'express';
import { ProductCategoryControllers } from './productCategory.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductCategoryValidations } from './productCategory.validation';

const router = Router();

router.get(
  '/group-categories',
  ProductCategoryControllers.getGroupedCategories,
);

router.get('/:id', ProductCategoryControllers.getOneCategory);

router.post('/bulk-create', ProductCategoryControllers.createManyCategory);

router.post(
  '/',
  validateRequest(ProductCategoryValidations.createSchema),
  ProductCategoryControllers.createOneCategory,
);

router.get('/', ProductCategoryControllers.getManyCategories);

export const ProductCategoryRoutes = router;
