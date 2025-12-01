import { z } from 'zod';

export const createContactDto = z.object({
  body: z.object({
    type: z.enum(['phone', 'email', 'address', 'social']),
    value: z.string().min(1),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        label: z.string().max(255).optional(),
      })
    ).optional(),
  }),
});

export const updateContactDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    type: z.enum(['phone', 'email', 'address', 'social']).optional(),
    value: z.string().min(1).optional(),
    displayOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
    translations: z.array(
      z.object({
        language: z.enum(['en', 'ru', 'arm']),
        label: z.string().max(255).optional().nullable(),
      })
    ).optional(),
  }),
});

export const getContactDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    language: z.enum(['en', 'ru', 'arm']).default('en'),
  }),
});

export const listContactsDto = z.object({
  query: z.object({
    type: z.enum(['phone', 'email', 'address', 'social']).optional(),
    isActive: z.boolean().optional(),
    language: z.enum(['en', 'ru', 'arm']).default('en'),
    sortBy: z.string().default('display_order'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
});

export const submitContactFormDto = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().max(50).optional(),
    subject: z.string().max(255).optional(),
    message: z.string().min(1),
  }),
});

export const deleteContactDto = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateContactDto = z.infer<typeof createContactDto>;
export type UpdateContactDto = z.infer<typeof updateContactDto>;
export type GetContactDto = z.infer<typeof getContactDto>;
export type ListContactsDto = z.infer<typeof listContactsDto>;
export type SubmitContactFormDto = z.infer<typeof submitContactFormDto>;

