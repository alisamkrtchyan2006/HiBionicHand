import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../database/prisma.client';

export class ContactsService {
  async create(data: {
    type: 'phone' | 'email' | 'address' | 'social';
    value: string;
    displayOrder: number;
    isActive: boolean;
    translations?: Array<{
      language: 'en' | 'ru' | 'arm';
      label?: string;
    }>;
  }) {
    return prisma.contact.create({
      data: {
        type: data.type,
        value: data.value,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
        translations: data.translations
          ? {
              create: data.translations.map((t) => ({
                language: t.language,
                label: t.label,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
      },
    });
  }

  async findById(id: string, language: 'en' | 'ru' | 'arm' = 'en') {
    return prisma.contact.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
        },
      },
    });
  }

  async list(params: {
    type?: 'phone' | 'email' | 'address' | 'social';
    isActive?: boolean;
    language?: 'en' | 'ru' | 'arm';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const language = params.language || 'en';
    const sortBy = params.sortBy || 'display_order';
    const sortOrder = params.sortOrder || 'asc';

    const where: Prisma.ContactWhereInput = {
      ...(params.type && { type: params.type }),
      ...(params.isActive !== undefined && { isActive: params.isActive }),
    };

    return prisma.contact.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        translations: {
          where: { language },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      type?: 'phone' | 'email' | 'address' | 'social';
      value?: string;
      displayOrder?: number;
      isActive?: boolean;
      translations?: Array<{
        language: 'en' | 'ru' | 'arm';
        label?: string | null;
      }>;
    }
  ) {
    // Handle translations update
    if (data.translations) {
      for (const translation of data.translations) {
        await prisma.contactTranslation.upsert({
          where: {
            contactId_language: {
              contactId: id,
              language: translation.language,
            },
          },
          update: {
            label: translation.label,
          },
          create: {
            contactId: id,
            language: translation.language,
            label: translation.label,
          },
        });
      }
    }

    // Update contact
    const updateData: Prisma.ContactUpdateInput = {
      ...(data.type && { type: data.type }),
      ...(data.value && { value: data.value }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    return prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.contact.delete({
      where: { id },
    });
  }

  async submitForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    return prisma.contactFormSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        status: 'new',
      },
    });
  }

  async getSubmissions(params: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ContactFormSubmissionWhereInput = {
      ...(params.status && { status: params.status }),
    };

    const [data, total] = await Promise.all([
      prisma.contactFormSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactFormSubmission.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

