import { Router } from 'express';
import { ShippingAddressControllers } from './shippingAddress.controller';

const router = Router();

router.post('/', ShippingAddressControllers.addAddress);

router.get('/', ShippingAddressControllers.getManyAddresses);

router.delete('/:id', ShippingAddressControllers.deleteOneAddress);

router.put('/:id', ShippingAddressControllers.updateAddress);

export const ShippingAddressRoutes = router;
