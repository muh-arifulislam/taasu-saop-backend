import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import Stripe from 'stripe';

const stripe = new Stripe(
  'sk_test_51L3CzjIh6oFyk289lmBeDnkiVwPytxA1tFBSRygUHmMKMJcyqVs80ZxdKcxXCtngbcJ0h6KlAT7fVoX6yZZHB0Cv00pMaOKyBR',
);

const createPaymentIntentForStripe = catchAsync(async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Intent created successfull',
    data: paymentIntent,
  });
});

export const PaymentControllers = {
  createPaymentIntentForStripe,
};
