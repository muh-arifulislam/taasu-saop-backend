export const PAYMENT_METHOD = {
  COD: 'COD',
  Stripe: 'Stripe',
} as const;

export const PAYMENT_STATUS = {
  paid: 'Paid',
  pending: 'Pending',
} as const;

export const PaymentStatus = ['Paid', 'Pending'] as const;

export const PaymentMethod = ['COD', 'Stripe'] as const;
