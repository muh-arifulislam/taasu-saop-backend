import { Order } from './order.model';

const PAD_LENGTH = 5; // Length of the sequential number padding

export async function generateOrderId(): Promise<string> {
  try {
    // Find the last order to get the latest orderId
    const lastOrder = await Order.findOne()
      .sort({ createdAt: -1 })
      .select('orderId')
      .lean();
    let lastOrderId = 0;

    if (lastOrder) {
      lastOrderId = parseInt(lastOrder.orderId);
    }

    const newOrderId = `${String(lastOrderId + 1).padStart(PAD_LENGTH, '0')}`;
    return newOrderId;
  } catch (err) {
    throw new Error('Failed to generate orderId');
  }
}
