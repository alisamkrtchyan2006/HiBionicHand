import { z } from 'zod';

export const loginDto = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerDto = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(['admin', 'editor', 'user']).optional().default('user'),
  }),
});

export const refreshTokenDto = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

