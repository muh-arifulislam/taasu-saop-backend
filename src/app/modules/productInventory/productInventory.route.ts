import { Router } from 'express';
import { ProductInventoryControllers } from './productInventory.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductInventoryValidations } from './productInventory.validation';

const router = Router();

router.get('/:id', ProductInventoryControllers.findOneInventory);

router.post(
  '/',
  validateRequest(ProductInventoryValidations.createSchema),
  ProductInventoryControllers.createOneInventory,
);

router.get('/', ProductInventoryControllers.findManyInventory);

export const ProductInventoryRoutes = router;
