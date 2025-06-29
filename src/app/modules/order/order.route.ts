import { Router } from 'express';
import { OrderControllers } from './order.controller';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/place-order/cash-on-delivery', OrderControllers.placeOrderViaCOD);

router.post('/place-order/stripe', OrderControllers.placeOrderViaStripe);

router.get(
  '/me',
  validateAuth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.superAdmin),
  OrderControllers.getUserOrders,
);

router.get(
  '/:id',
  // validateAuth(USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.superAdmin),
  OrderControllers.getOrder,
);

router.put('/:id', OrderControllers.updateOrder);

router.get(
  '/',
  // validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  OrderControllers.getOrders,
);

export const OrderRoutes = router;
