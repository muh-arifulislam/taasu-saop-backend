export const ORDER_STATUS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  halted: 'Halted',
} as const;

export const ORDER_STATUS_MESSAGES = {
  Pending: 'Your order has been placed and is waiting to be processed.',
  Processing: "We're preparing your order.",
  Shipped: 'Your order is on its way.',
  Delivered: 'Your order has arrived.',
  Completed: 'Your order is successfully completed.',
  Cancelled: 'Your order has been canceled.',
  Halted: 'Your order is on hold.',
} as const;

export const OrderStatus = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Completed',
  'Cancelled',
  'Halted',
] as const;
