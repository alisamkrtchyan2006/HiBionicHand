import { z } from 'zod';

export const createProductDto = z.object({
  body: z.object({
    parentId: z.string().uuid().optional(),
    type: z.enum(['upper_limb', 'lower_limb']),
    slug: z.string().min(1).max(255).optional(),
    sku: z.string().max(100).optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    featuredImageId: z.string().uuid().optional(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().optional(),
      })
    ).min(1),
    specs: z.array(
      z.object({
        specKey: z.string().min(1).max(100),
        specValue: z.string().min(1),
        displayOrder: z.number().int().default(0),
      })
    ).optional(),
  }),
});

export const updateProductDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    categoryId: z.string().uuid().optional(),
    parentId: z.string().uuid().optional().nullable(),
    type: z.enum(['upper_limb', 'lower_limb']).optional(),
    slug: z.string().min(1).max(255).optional(),
    sku: z.string().max(100).optional().nullable(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    featuredImageId: z.string().uuid().optional().nullable(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional().nullable(),
        shortDescription: z.string().optional().nullable(),
        metaTitle: z.string().max(255).optional().nullable(),
        metaDescription: z.string().optional().nullable(),
      })
    ).optional(),
    specs: z.array(
      z.object({
        id: z.string().uuid().optional(),
        specKey: z.string().min(1).max(100),
        specValue: z.string().min(1),
        displayOrder: z.number().int().default(0),
      })
    ).optional(),
  }),
});

export const getProductDto = z.object({
  params: z.object({
    id: z.string().uuid().optional(),
    slug: z.string().optional(),
  }),
  query: z.object({
    language: z.enum(['en', 'ru', 'arm']).default('en'),
  }),
});

export const listProductsDto = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || '1', 10)),
    limit: z.string().optional().transform((val) => parseInt(val || '10', 10)),
    categoryId: z.string().uuid().optional(),
    type: z.enum(['upper_limb', 'lower_limb']).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    language: z.enum(['en', 'ru', 'arm']).default('en'),
    search: z.string().optional(),
    sortBy: z.string().default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const deleteProductDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateProductDto = z.infer<typeof createProductDto>;
export type UpdateProductDto = z.infer<typeof updateProductDto>;
export type GetProductDto = z.infer<typeof getProductDto>;
export type ListProductsDto = z.infer<typeof listProductsDto>;

