import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

router.post('/create-intent', PaymentControllers.createPaymentIntentForStripe);

export const PaymentRoutes = router;
