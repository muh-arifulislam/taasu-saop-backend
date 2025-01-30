export const ORDER_STATUS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  halted: 'Halted',
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
