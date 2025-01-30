import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    quantity: z
      .number({
        required_error: 'Quantity is required.',
        invalid_type_error: 'Quantity must be a number.',
      })
      .min(0, 'Quantity cannot be less than 0.'),
    sold: z
      .number({
        invalid_type_error: 'Sold must be a number.',
      })
      .min(0, 'Sold cannot be less than 0.')
      .optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    quantity: z
      .number({
        required_error: 'Quantity is required.',
        invalid_type_error: 'Quantity must be a number.',
      })
      .min(0, 'Quantity cannot be less than 0.')
      .optional(),
    sold: z
      .number({
        invalid_type_error: 'Sold must be a number.',
      })
      .min(0, 'Sold cannot be less than 0.')
      .optional(),
  }),
});

export const ProductInventoryValidations = { createSchema, updateSchema };
