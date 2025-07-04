import { IPayment } from './payment.interface';
import { Payment } from './payment.model';

const addPaymentIntoDB = async (payload: IPayment) => {
  const result = await Payment.create(payload);

  return result;
};

const getPaymentsFromDB = async () => {
  const result = await Payment.find();

  return result;
};

export const PaymentServices = { addPaymentIntoDB, getPaymentsFromDB };
