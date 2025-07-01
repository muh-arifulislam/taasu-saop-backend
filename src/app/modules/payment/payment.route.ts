import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

router.get('/', PaymentControllers.getPayments);

export const PaymentRoutes = router;
