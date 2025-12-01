import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationUtil, PaginationParams } from '../utils/pagination.util';
import prisma from '../database/prisma.client';

export class ReviewsService {
  async create(data: {
    productId?: string;
    authorName: string;
    authorEmail?: string;
    authorAvatarUrl?: string;
    rating: number;
    translations: Array<{
      language: 'en' | 'ru' | 'arm';
      title?: string;
      content: string;
    }>;
  }) {
    return prisma.review.create({
      data: {
        productId: data.productId,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        authorAvatarUrl: data.authorAvatarUrl,
        rating: data.rating,
        translations: {
          create: data.translations.map((t) => ({
            language: t.language,
            title: t.title,
            content: t.content,
          })),
        },
      },
      include: {
        translations: true,
        product: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  async findById(id: string, language: 'en' | 'ru' | 'arm' = 'en') {
    return prisma.review.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
        },
        product: {
          include: {
            translations: {
              where: { language },
            },
          },
        },
      },
    });
  }

  async list(params: PaginationParams & {
    productId?: string;
    status?: 'pending' | 'approved' | 'rejected';
    isFeatured?: boolean;
    language?: 'en' | 'ru' | 'arm';
  }) {
    const { page, limit, skip, sortBy, sortOrder } = PaginationUtil.parse(params);
    const language = params.language || 'en';

    const where: Prisma.ReviewWhereInput = {
      ...(params.productId && { productId: params.productId }),
      ...(params.status && { status: params.status }),
      ...(params.isFeatured !== undefined && { isFeatured: params.isFeatured }),
    };

    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          translations: {
            where: { language },
          },
          product: {
            include: {
              translations: {
                where: { language },
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return PaginationUtil.createResult(data, total, page, limit);
  }

  async update(
    id: string,
    data: {
      status?: 'pending' | 'approved' | 'rejected';
      isFeatured?: boolean;
      translations?: Array<{
        language: 'en' | 'ru' | 'arm';
        title?: string | null;
        content?: string;
      }>;
    }
  ) {
    // Handle translations update
    if (data.translations) {
      for (const translation of data.translations) {
        await prisma.reviewTranslation.upsert({
          where: {
            reviewId_language: {
              reviewId: id,
              language: translation.language,
            },
          },
          update: {
            title: translation.title,
            content: translation.content,
          },
          create: {
            reviewId: id,
            language: translation.language,
            title: translation.title,
            content: translation.content || '',
          },
        });
      }
    }

    // Update review
    const updateData: Prisma.ReviewUpdateInput = {
      ...(data.status && { status: data.status }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
    };

    return prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        product: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.review.delete({
      where: { id },
    });
  }

  async getProductRatingStats(productId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        status: 'approved',
      },
      select: {
        rating: true,
      },
    });

    const total = reviews.length;
    const average = total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;
    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: reviews.filter((r) => r.rating === rating).length,
    }));

    return {
      total,
      average: Math.round(average * 10) / 10,
      distribution,
    };
  }
}

