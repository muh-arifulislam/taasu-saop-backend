import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.',
    }),
    sku: z.string({
      required_error: 'SKU is required.',
      invalid_type_error: 'SKU must be a string.',
    }),
    price: z
      .number({
        required_error: 'Price is required.',
        invalid_type_error: 'Price must be a number.',
      })
      .min(0, 'Price cannot be negative.'),
    descriptions: z
      .array(
        z.string({
          invalid_type_error: 'Each description must be a string.',
        }),
      )
      .min(1, 'Descriptions must have at least one item.'),
    advantages: z
      .array(
        z.string({
          invalid_type_error: 'Each advantage must be a string.',
        }),
      )
      .min(1, 'Advantages must have at least one item.'),
    ingredients: z
      .array(
        z.string({
          invalid_type_error: 'Each ingredient must be a string.',
        }),
      )
      .min(1, 'Ingredients must have at least one item.'),
    addInformation: z.object({
      weight: z.string({
        required_error: 'Weight is required.',
        invalid_type_error: 'Weight must be a string.',
      }),
      dimension: z
        .string({
          invalid_type_error: 'Dimension must be a string.',
        })
        .optional(),
      direction: z
        .string({
          invalid_type_error: 'Direction must be a string.',
        })
        .optional(),
      warnings: z
        .string({
          invalid_type_error: 'Warnings must be a string.',
        })
        .optional(),
    }),
    category: z.string({
      required_error: 'CategoryId is required.',
      invalid_type_error: 'CategoryId must be a valid string.',
    }),
    stock: z
      .number({
        required_error: 'Stock is required.',
        invalid_type_error: 'Stock must be a number.',
      })
      .min(1),
    discountId: z
      .string({
        invalid_type_error: 'DiscountId must be a valid ObjectId as a string.',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'DiscountId must be a valid ObjectId.')
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
      .optional(),
    sku: z
      .string({
        required_error: 'SKU is required.',
        invalid_type_error: 'SKU must be a string.',
      })
      .optional(),
    price: z
      .number({
        required_error: 'Price is required.',
        invalid_type_error: 'Price must be a number.',
      })
      .min(0, 'Price cannot be negative.')
      .optional(),
    descriptions: z
      .array(
        z.string({
          invalid_type_error: 'Each description must be a string.',
        }),
      )
      .optional(),
    advantages: z
      .array(
        z.string({
          invalid_type_error: 'Each advantage must be a string.',
        }),
      )
      .optional(),
    ingredients: z
      .array(
        z.string({
          invalid_type_error: 'Each ingredient must be a string.',
        }),
      )
      .optional(),
    addInformation: z.object({
      weight: z
        .string({
          required_error: 'Weight is required.',
          invalid_type_error: 'Weight must be a string.',
        })
        .optional(),
      dimension: z
        .string({
          invalid_type_error: 'Dimension must be a string.',
        })
        .optional(),
      direction: z
        .string({
          invalid_type_error: 'Direction must be a string.',
        })
        .optional(),
      warnings: z
        .string({
          invalid_type_error: 'Warnings must be a string.',
        })
        .optional(),
    }),
    categoryId: z
      .string({
        required_error: 'CategoryId is required.',
        invalid_type_error: 'CategoryId must be a valid ObjectId as a string.',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'CategoryId must be a valid ObjectId.')
      .optional(),
    inventoryId: z
      .string({
        required_error: 'InventoryId is required.',
        invalid_type_error: 'InventoryId must be a valid ObjectId as a string.',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'InventoryId must be a valid ObjectId.')
      .optional(),
    discountId: z
      .string({
        invalid_type_error: 'DiscountId must be a valid ObjectId as a string.',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'DiscountId must be a valid ObjectId.')
      .optional(),
  }),
});

export const ProductValidations = { createSchema, updateSchema };
