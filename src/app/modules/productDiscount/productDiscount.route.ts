import { Router } from 'express';
import { ProductDiscountControllers } from './productDiscount.controller';

const router = Router();

router.post('/', ProductDiscountControllers.create);
router.get('/', ProductDiscountControllers.getAll);
router.get('/:id', ProductDiscountControllers.getById);
router.put('/:id', ProductDiscountControllers.update);
router.delete('/:id', ProductDiscountControllers.remove);

export const ProductDiscountRoutes = router;
