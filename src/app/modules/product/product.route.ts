import { Router } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';

const router = Router();

router.get('/:id', ProductControllers.getOneProduct);

router.delete('/:id', ProductControllers.deleteOneById);

router.post(
  '/',
  validateRequest(ProductValidations.createSchema),
  ProductControllers.createOneProduct,
);

router.get(
  '/',

  ProductControllers.getManyProduct,
);

export const ProductRoutes = router;
