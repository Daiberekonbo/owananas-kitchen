import { z } from 'zod';

const price = z.coerce.number().int().nonnegative();

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200)
});

const foodFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200),
  price,
  description: z.string().trim().max(2000),
  image: z.string().trim().max(500),
  category: z.string().trim().min(1).max(100)
});

export const foodSchema = foodFieldsSchema.extend({
  description: z.string().trim().max(2000).default(''),
  image: z.string().trim().max(500).default('')
});

export const foodUpdateSchema = foodFieldsSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one food field must be supplied.' }
);

const packageFieldsSchema = z.object({
  id: z.string().trim().min(1).max(100).optional(),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000),
  price,
  image: z.string().trim().max(500)
});

export const packageSchema = packageFieldsSchema.extend({
  description: z.string().trim().max(2000).default(''),
  image: z.string().trim().max(500).default('')
});

export const packageUpdateSchema = packageFieldsSchema.omit({ id: true }).partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one package field must be supplied.' }
);

const orderItemSchema = z.object({
  id: z.union([z.number().int().positive(), z.string().trim().min(1).max(100)]),
  name: z.string().trim().max(200).optional(),
  price: price.optional(),
  quantity: z.coerce.number().int().positive().max(1000),
  type: z.enum(['food', 'package']).optional()
});

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1).max(200),
    phone: z.string().trim().min(3).max(50),
    whatsapp: z.string().trim().min(3).max(50),
    email: z.string().trim().email().max(320),
    address: z.string().trim().min(5).max(1000),
    notes: z.string().trim().max(2000).optional().default('')
  }),
  items: z.array(orderItemSchema).min(1).max(100),
  total: price.optional()
});

export const staffSchema = z.object({
  username: z.string().trim().min(3).max(100),
  password: z.string().min(8).max(200)
});