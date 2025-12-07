import { Payment } from './payment.model';

const PAD_LENGTH = 4; // Length of the sequential number padding

export async function generatePaymentId(): Promise<string> {
  try {
    // Find the last order to get the latest orderId
    const lastPayment = await Payment.findOne()
      .sort({ createdAt: -1 })
      .select('orderId')
      .lean();
    let lastPaymentId = 0;

    if (lastPayment) {
      lastPaymentId = parseInt(lastPayment.paymentId.split('-')[1]);
    }

    const newPaymentId = `PAY-${String(lastPaymentId + 1).padStart(PAD_LENGTH, '0')}`;
    return newPaymentId;
  } catch (err) {
    throw new Error('Failed to generate orderId');
  }
}
