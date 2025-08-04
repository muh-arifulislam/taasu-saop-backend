import { Router } from 'express';
import { ProductCategoryControllers } from './productCategory.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductCategoryValidations } from './productCategory.validation';

const router = Router();

router.post(
  '/',
  validateRequest(ProductCategoryValidations.createSchema),
  ProductCategoryControllers.createOneCategory,
);

router.get('/', ProductCategoryControllers.getManyCategories);

router.post('/bulk-create', ProductCategoryControllers.createManyCategory);

router.get(
  '/group-categories',
  ProductCategoryControllers.getGroupedCategories,
);

router.get('/:id', ProductCategoryControllers.getOneCategory);

router.put('/:id', ProductCategoryControllers.updateOneCategory);

router.delete('/:id', ProductCategoryControllers.softDeleteCategory);

export const ProductCategoryRoutes = router;
