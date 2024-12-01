import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required.',
        invalid_type_error: 'Name must be a string.',
      })
      .min(1, 'Name cannot be empty.'),
    description: z
      .string({
        invalid_type_error: 'Description must be a string.',
      })
      .optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required.',
        invalid_type_error: 'Name must be a string.',
      })
      .min(1, 'Name cannot be empty.')
      .optional(),
    description: z
      .string({
        invalid_type_error: 'Description must be a string.',
      })
      .optional(),
  }),
});

export const ProductCategoryValidations = { createSchema, updateSchema };
