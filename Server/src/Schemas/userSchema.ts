import { z } from 'zod';

const mobileNumberSchema = z
  .string()
  .regex(/^[1-9]\d{9}$/, 'Phone number must be exactly 10 digits and not start with 0');

const countryCodeSchema = z
  .string()
  .regex(/^\+\d{1,4}$/, 'Invalid country code. Use format like +91 or +1');

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, { message: 'Username must be at least 5 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' })
    .regex(/^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/, {
      message:
        'Username can only contain letters, numbers, underscores, and single spaces between words.',
    }),

  mobileNumber: mobileNumberSchema,
  countryCode: countryCodeSchema,
  gender: z.enum(['Male', 'Female', 'Others']),

  height: z
    .number({
      invalid_type_error: 'Height must be a number.',
    })
    .min(30, { message: 'Height must be at least 30 cm.' })
    .max(300, { message: 'Height must be in cm and less than 300.' }),

  weight: z
    .number({
      invalid_type_error: 'Weight must be a number.',
    })
    .min(10, { message: 'Weight must be at least 10 kg.' })
    .max(300, { message: 'Weight must be in kg and less than 300.' }),

  age: z.number({
    invalid_type_error: 'Age must be a number.',
  }),
});

export const loginSchema = z.object({
  mobileNumber: mobileNumberSchema,
  countryCode: countryCodeSchema,
});

export const otpSchema = loginSchema.extend({
  otp: z.string().length(4, 'Incorrect OTP').regex(/^\d+$/, 'Incorrect OTP'),
});
