import { Router } from 'express';
import { ProductCategoryControllers } from './productCategory.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductCategoryValidations } from './productCategory.validation';

const router = Router();

router.get('/:id', ProductCategoryControllers.getOneCategory);

router.post(
  '/',
  validateRequest(ProductCategoryValidations.createSchema),
  ProductCategoryControllers.createOneCategory,
);

router.get(
  '/',

  ProductCategoryControllers.getManyCategories,
);

export const ProductCategoryRoutes = router;
