import { Prisma, PrismaClient } from '@prisma/client';
import { PaginationUtil, PaginationParams } from '../utils/pagination.util';
import { SlugUtil } from '../utils/slug.util';
import prisma from '../database/prisma.client';

export class NewsService {
  async create(data: {
    slug?: string;
    featuredImageId?: string;
    authorId: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
    translations: Array<{
      language: 'en' | 'ru' | 'arm';
      title: string;
      content: string;
      excerpt?: string;
      metaTitle?: string;
      metaDescription?: string;
    }>;
  }) {
    // Generate slug if not provided
    const baseTitle = data.translations.find((t) => t.language === 'en')?.title || data.translations[0].title;
    const slug = data.slug || SlugUtil.generate(baseTitle);

    // Check if slug exists
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (existingNews) {
      const allSlugs = await prisma.news.findMany({ select: { slug: true } });
      const uniqueSlug = SlugUtil.makeUnique(slug, allSlugs.map((n) => n.slug));
      data.slug = uniqueSlug;
    } else {
      data.slug = slug;
    }

    return prisma.news.create({
      data: {
        slug: data.slug!,
        featuredImageId: data.featuredImageId,
        authorId: data.authorId,
        status: data.status,
        publishedAt: data.publishedAt || (data.status === 'published' ? new Date() : null),
        translations: {
          create: data.translations.map((t) => ({
            language: t.language,
            title: t.title,
            content: t.content,
            excerpt: t.excerpt,
            metaTitle: t.metaTitle,
            metaDescription: t.metaDescription,
          })),
        },
      },
      include: {
        translations: true,
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        featuredImage: true,
      },
    });
  }

  async findById(id: string, language: 'en' | 'ru' | 'arm' = 'en') {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
        },
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        featuredImage: true,
      },
    });

    // Increment views count
    if (news && news.status === 'published') {
      await prisma.news.update({
        where: { id },
        data: { viewsCount: { increment: 1 } },
      });
      news.viewsCount += 1;
    }

    return news;
  }

  async findBySlug(slug: string, language: 'en' | 'ru' | 'arm' = 'en') {
    const news = await prisma.news.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { language },
        },
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        featuredImage: true,
      },
    });

    // Increment views count
    if (news && news.status === 'published') {
      await prisma.news.update({
        where: { slug },
        data: { viewsCount: { increment: 1 } },
      });
      news.viewsCount += 1;
    }

    return news;
  }

  async list(params: PaginationParams & {
    status?: 'draft' | 'published' | 'archived';
    language?: 'en' | 'ru' | 'arm';
    search?: string;
  }) {
    const { page, limit, skip, sortBy, sortOrder } = PaginationUtil.parse(params);
    const language = params.language || 'en';

    const where: Prisma.NewsWhereInput = {
      ...(params.status && { status: params.status }),
      ...(params.search && {
        translations: {
          some: {
            language,
            OR: [
              { title: { contains: params.search, mode: 'insensitive' } },
              { content: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          translations: {
            where: { language },
          },
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          featuredImage: true,
        },
      }),
      prisma.news.count({ where }),
    ]);

    return PaginationUtil.createResult(data, total, page, limit);
  }

  async update(
    id: string,
    data: {
      slug?: string;
      featuredImageId?: string | null;
      status?: 'draft' | 'published' | 'archived';
      publishedAt?: Date | null;
      translations?: Array<{
        language: 'en' | 'ru' | 'arm';
        title?: string;
        content?: string;
        excerpt?: string | null;
        metaTitle?: string | null;
        metaDescription?: string | null;
      }>;
    }
  ) {
    // Handle translations update
    if (data.translations) {
      for (const translation of data.translations) {
        await prisma.newsTranslation.upsert({
          where: {
            newsId_language: {
              newsId: id,
              language: translation.language,
            },
          },
          update: {
            title: translation.title,
            content: translation.content,
            excerpt: translation.excerpt,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
          },
          create: {
            newsId: id,
            language: translation.language,
            title: translation.title || '',
            content: translation.content || '',
            excerpt: translation.excerpt,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
          },
        });
      }
    }

    // Update news
    const updateData: Prisma.NewsUpdateInput = {
      ...(data.slug && { slug: data.slug }),
      ...(data.featuredImageId !== undefined && { featuredImageId: data.featuredImageId }),
      ...(data.status && { status: data.status }),
      ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt }),
    };

    return prisma.news.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        featuredImage: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.news.delete({
      where: { id },
    });
  }
}

