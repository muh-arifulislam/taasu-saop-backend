import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const addPaymentIntoDB = async (payload: IPayment) => {
  const result = await Payment.create(payload);

  return result;
};

export const PaymentServices = { addPaymentIntoDB };
