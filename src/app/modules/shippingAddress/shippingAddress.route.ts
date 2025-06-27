import { Router } from 'express';
import { ShippingAddressControllers } from './shippingAddress.controller';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post('/', ShippingAddressControllers.addAddress);

router.get(
  '/',
  validateAuth(USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.superAdmin),
  ShippingAddressControllers.getManyAddresses,
);

router.delete('/:id', ShippingAddressControllers.deleteOneAddress);

router.put('/:id', ShippingAddressControllers.updateAddress);

export const ShippingAddressRoutes = router;
