import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required.' })
      .email('Please! enter a valid email.'),
    password: z.string({
      required_error: 'Password is required.',
      invalid_type_error: 'Invalid type. Please enter a string',
    }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
