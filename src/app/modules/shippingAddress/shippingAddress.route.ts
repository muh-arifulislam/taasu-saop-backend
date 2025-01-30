import { Router } from 'express';
import { ShippingAddressControllers } from './shippingAddress.controller';

const router = Router();

router.post('/', ShippingAddressControllers.addAddress);

router.delete('/:id', ShippingAddressControllers.deleteOneAddress);

router.get('/', ShippingAddressControllers.getManyAddresses);

export const ShippingAddressRoutes = router;
