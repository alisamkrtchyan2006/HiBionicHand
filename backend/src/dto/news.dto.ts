import { z } from 'zod';

export const createNewsDto = z.object({
  body: z.object({
    slug: z.string().min(1).max(255).optional().or(z.literal('').transform(() => undefined)),
    featuredImageId: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    publishedAt: z.string().datetime().optional(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().optional(),
      })
    ).min(1),
  }),
});

export const updateNewsDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    slug: z.string().min(1).max(255).optional(),
    featuredImageId: z.string().uuid().optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    publishedAt: z.string().datetime().optional().nullable(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional().nullable(),
        metaTitle: z.string().max(255).optional().nullable(),
        metaDescription: z.string().optional().nullable(),
      })
    ).optional(),
  }),
});

export const getNewsDto = z.object({
  params: z.object({
    id: z.string().uuid().optional(),
    slug: z.string().optional(),
  }),
  query: z.object({
    language: z.enum(['en', 'ru', 'arm']).default('en'),
  }),
});

export const listNewsDto = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || '1', 10)),
    limit: z.string().optional().transform((val) => parseInt(val || '10', 10)),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    language: z.enum(['en', 'ru', 'arm']).default('en'),
    search: z.string().optional(),
    sortBy: z.string().default('published_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const deleteNewsDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateNewsDto = z.infer<typeof createNewsDto>;
export type UpdateNewsDto = z.infer<typeof updateNewsDto>;
export type GetNewsDto = z.infer<typeof getNewsDto>;
export type ListNewsDto = z.infer<typeof listNewsDto>;

