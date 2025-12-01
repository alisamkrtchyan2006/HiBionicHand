import { z } from 'zod';

export const createReviewDto = z.object({
  body: z.object({
    productId: z.string().uuid().optional(),
    authorName: z.string().min(1).max(100),
    authorEmail: z.string().email().optional(),
    authorAvatarUrl: z.string().url().optional(),
    rating: z.number().int().min(1).max(5),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        title: z.string().max(255).optional(),
        content: z.string().min(1),
      })
    ).min(1),
  }),
});

export const updateReviewDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    isFeatured: z.boolean().optional(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        title: z.string().max(255).optional().nullable(),
        content: z.string().min(1).optional(),
      })
    ).optional(),
  }),
});

export const getReviewDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    language: z.enum(['en', 'ru', 'arm']).default('en'),
  }),
});

export const listReviewsDto = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || '1', 10)),
    limit: z.string().optional().transform((val) => parseInt(val || '10', 10)),
    productId: z.string().uuid().optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    isFeatured: z.boolean().optional(),
    language: z.enum(['en', 'ru', 'arm']).default('en'),
    sortBy: z.string().default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const deleteReviewDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateReviewDto = z.infer<typeof createReviewDto>;
export type UpdateReviewDto = z.infer<typeof updateReviewDto>;
export type GetReviewDto = z.infer<typeof getReviewDto>;
export type ListReviewsDto = z.infer<typeof listReviewsDto>;

