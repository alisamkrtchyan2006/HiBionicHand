import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationUtil, PaginationParams } from '../utils/pagination.util';
import prisma from '../database/prisma.client';

export class PartnersService {
  async create(data: {
    name: string;
    logoId?: string;
    websiteUrl?: string;
    displayOrder: number;
    isActive: boolean;
    translations?: Array<{
      language: 'en' | 'ru' | 'arm';
      description?: string;
    }>;
  }) {
    return prisma.partner.create({
      data: {
        name: data.name,
        logoId: data.logoId,
        websiteUrl: data.websiteUrl,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
        translations: data.translations
          ? {
              create: data.translations.map((t) => ({
                language: t.language,
                description: t.description,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
        logo: true,
      },
    });
  }

  async findById(id: string, language: 'en' | 'ru' | 'arm' = 'en') {
    return prisma.partner.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
        },
        logo: true,
      },
    });
  }

  async list(params: PaginationParams & {
    isActive?: boolean;
    language?: 'en' | 'ru' | 'arm';
  }) {
    const { page, limit, skip, sortBy, sortOrder } = PaginationUtil.parse(params);
    const language = params.language || 'en';

    const where: Prisma.PartnerWhereInput = {
      ...(params.isActive !== undefined && { isActive: params.isActive }),
    };

    const [data, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          translations: {
            where: { language },
          },
          logo: true,
        },
      }),
      prisma.partner.count({ where }),
    ]);

    return PaginationUtil.createResult(data, total, page, limit);
  }

  async update(
    id: string,
    data: {
      name?: string;
      logoId?: string | null;
      websiteUrl?: string | null;
      displayOrder?: number;
      isActive?: boolean;
      translations?: Array<{
        language: 'en' | 'ru' | 'arm';
        description?: string | null;
      }>;
    }
  ) {
    // Handle translations update
    if (data.translations) {
      for (const translation of data.translations) {
        await prisma.partnerTranslation.upsert({
          where: {
            partnerId_language: {
              partnerId: id,
              language: translation.language,
            },
          },
          update: {
            description: translation.description,
          },
          create: {
            partnerId: id,
            language: translation.language,
            description: translation.description,
          },
        });
      }
    }

    // Update partner
    const updateData: Prisma.PartnerUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.logoId !== undefined && { logoId: data.logoId }),
      ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    return prisma.partner.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        logo: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.partner.delete({
      where: { id },
    });
  }
}

