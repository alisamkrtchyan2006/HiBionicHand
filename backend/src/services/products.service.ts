import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationUtil, PaginationParams } from '../utils/pagination.util';
import { SlugUtil } from '../utils/slug.util';
import prisma from '../database/prisma.client';

export class ProductsService {
  async create(data: {
    parentId?: string;
    type: 'upper_limb' | 'lower_limb';
    slug?: string;
    sku?: string;
    status: 'draft' | 'published' | 'archived';
    featuredImageId?: string;
    createdBy: string;
    translations: Array<{
      language: 'en' | 'ru' | 'arm';
      name: string;
      description?: string;
      shortDescription?: string;
      metaTitle?: string;
      metaDescription?: string;
    }>;
    specs?: Array<{
      specKey: string;
      specValue: string;
      displayOrder: number;
    }>;
  }) {
    // Generate slug if not provided
    if (!data.translations || data.translations.length === 0) {
      throw new Error('At least one translation is required');
    }
    const baseName = data.translations.find((t) => t.language === 'en')?.name || data.translations[0]?.name;
    if (!baseName) {
      throw new Error('Product name is required in translations');
    }
    const slug = data.slug || SlugUtil.generate(baseName);

    // Check if slug exists
    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      const allSlugs = await prisma.product.findMany({ select: { slug: true } });
      const uniqueSlug = SlugUtil.makeUnique(slug, allSlugs.map((p) => p.slug));
      data.slug = uniqueSlug;
    } else {
      data.slug = slug;
    }

    return prisma.product.create({
      data: {
        parentId: data.parentId,
        type: data.type,
        slug: data.slug!,
        sku: data.sku,
        status: data.status,
        featuredImageId: data.featuredImageId,
        createdById: data.createdBy,
        translations: {
          create: data.translations.map((t) => ({
            language: t.language,
            name: t.name,
            description: t.description,
            shortDescription: t.shortDescription,
            metaTitle: t.metaTitle,
            metaDescription: t.metaDescription,
          })),
        },
        specs: data.specs
          ? {
              create: data.specs.map((s) => ({
                specKey: s.specKey,
                specValue: s.specValue,
                displayOrder: s.displayOrder,
              })),
            }
          : undefined,
      },
      include: {
        translations: true,
        specs: true,
        featuredImage: true,
      },
    });
  }

  async findById(id: string, language: 'en' | 'ru' | 'arm' = 'en') {
    return prisma.product.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
        },
        specs: {
          orderBy: { displayOrder: 'asc' },
        },
        featuredImage: true,
        media: {
          include: {
            media: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string, language: 'en' | 'ru' | 'arm' = 'en') {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { language },
        },
        specs: {
          orderBy: { displayOrder: 'asc' },
        },
        featuredImage: true,
        media: {
          include: {
            media: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async list(params: PaginationParams & {
    type?: 'upper_limb' | 'lower_limb';
    status?: 'draft' | 'published' | 'archived';
    language?: 'en' | 'ru' | 'arm';
    search?: string;
  }) {
    const { page, limit, skip, sortBy, sortOrder } = PaginationUtil.parse(params);
    const language = params.language || 'en';

    const where: Prisma.ProductWhereInput = {
      ...(params.type && { type: params.type }),
      ...(params.status && { status: params.status }),
      ...(params.search && {
        translations: {
          some: {
            language,
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { description: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          translations: {
            where: { language },
          },
          featuredImage: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return PaginationUtil.createResult(data, total, page, limit);
  }

  async update(
    id: string,
    data: {
      parentId?: string | null;
      type?: 'upper_limb' | 'lower_limb';
      slug?: string;
      sku?: string | null;
      status?: 'draft' | 'published' | 'archived';
      featuredImageId?: string | null;
      translations?: Array<{
        language: 'en' | 'ru' | 'arm';
        name?: string;
        description?: string | null;
        shortDescription?: string | null;
        metaTitle?: string | null;
        metaDescription?: string | null;
      }>;
      specs?: Array<{
        id?: string;
        specKey: string;
        specValue: string;
        displayOrder: number;
      }>;
    }
  ) {
    // Handle translations update
    if (data.translations) {
      for (const translation of data.translations) {
        await prisma.productTranslation.upsert({
          where: {
            productId_language: {
              productId: id,
              language: translation.language,
            },
          },
          update: {
            name: translation.name,
            description: translation.description,
            shortDescription: translation.shortDescription,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
          },
          create: {
            productId: id,
            language: translation.language,
            name: translation.name || '',
            description: translation.description ?? null,
            shortDescription: translation.shortDescription ?? null,
            metaTitle: translation.metaTitle ?? null,
            metaDescription: translation.metaDescription ?? null,
          },
        });
      }
    }

    // Handle specs update
    if (data.specs) {
      // Delete existing specs
      await prisma.productSpec.deleteMany({ where: { productId: id } });
      // Create new specs
      await prisma.productSpec.createMany({
        data: data.specs.map((s) => ({
          productId: id,
          specKey: s.specKey,
          specValue: s.specValue,
          displayOrder: s.displayOrder,
        })),
      });
    }

    // Update product
    const updateData: Prisma.ProductUpdateInput = {
      ...(data.parentId !== undefined && { parentId: data.parentId }),
      ...(data.type && { type: data.type }),
      ...(data.slug && { slug: data.slug }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.status && { status: data.status }),
      ...(data.featuredImageId !== undefined && { featuredImageId: data.featuredImageId }),
    };

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        specs: true,
        featuredImage: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

