import { z } from 'zod';

export const createPartnerDto = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    logoId: z.string().uuid().optional(),
    websiteUrl: z.string().url().optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        description: z.string().optional(),
      })
    ).optional(),
  }),
});

export const updatePartnerDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    logoId: z.string().uuid().optional().nullable(),
    websiteUrl: z.string().url().optional().nullable(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        description: z.string().optional().nullable(),
      })
    ).optional(),
  }),
});

export const getPartnerDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    language: z.enum(['en', 'ru', 'arm']).default('en'),
  }),
});

export const listPartnersDto = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || '1', 10)),
    limit: z.string().optional().transform((val) => parseInt(val || '10', 10)),
    isActive: z.boolean().optional(),
    language: z.enum(['en', 'ru', 'arm']).default('en'),
    sortBy: z.string().default('display_order'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
});

export const deletePartnerDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreatePartnerDto = z.infer<typeof createPartnerDto>;
export type UpdatePartnerDto = z.infer<typeof updatePartnerDto>;
export type GetPartnerDto = z.infer<typeof getPartnerDto>;
export type ListPartnersDto = z.infer<typeof listPartnersDto>;

