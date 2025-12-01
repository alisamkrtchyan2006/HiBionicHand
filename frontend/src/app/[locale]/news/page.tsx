'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Article as ArticleIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';
import { useTranslations } from 'next-intl';

interface News {
  id: string;
  slug: string;
  status: string;
  viewsCount: number;
  publishedAt: string | null;
  featuredImage?: {
    url: string;
  };
  translations: Array<{
    language: string;
    title: string;
    excerpt: string;
  }>;
  author: {
    firstName: string;
    lastName: string;
  };
}

export default function NewsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/news', {
        params: {
          page,
          limit: 9,
          language: 'en',
          status: 'published',
        },
      });
      setNews(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
      // Use dummy data on error
      // setNews(getDummyNews());
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // const getDummyNews = (): News[] => [
  //   {
  //     id: '1',
  //     slug: 'new-bionic-hand-launch',
  //     status: 'published',
  //     viewsCount: 1250,
  //     publishedAt: '2024-01-15T10:00:00Z',
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Revolutionary New Bionic Hand Launched',
  //         excerpt:
  //           'We are excited to announce the launch of our latest bionic hand model featuring advanced AI capabilities and enhanced tactile feedback.',
  //       },
  //     ],
  //     author: { firstName: 'Alex', lastName: 'Petrov' },
  //   },
  //   {
  //     id: '2',
  //     slug: 'clinical-trial-success',
  //     status: 'published',
  //     viewsCount: 980,
  //     publishedAt: '2024-01-10T10:00:00Z',
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Clinical Trial Shows 95% Success Rate',
  //         excerpt:
  //           'Our latest clinical trial results demonstrate exceptional patient satisfaction and functional improvement rates.',
  //       },
  //     ],
  //     author: { firstName: 'Maria', lastName: 'Garcia' },
  //   },
  //   {
  //     id: '3',
  //     slug: 'partnership-announcement',
  //     status: 'published',
  //     viewsCount: 750,
  //     publishedAt: '2024-01-05T10:00:00Z',
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'New Partnership with Leading Medical Institutions',
  //         excerpt:
  //           'We are proud to announce partnerships with top medical institutions worldwide to expand access to our technology.',
  //       },
  //     ],
  //     author: { firstName: 'James', lastName: 'Wilson' },
  //   },
  //   {
  //     id: '4',
  //     slug: 'award-recognition',
  //     status: 'published',
  //     viewsCount: 650,
  //     publishedAt: '2023-12-20T10:00:00Z',
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'hiBionicHand Wins Innovation Award',
  //         excerpt:
  //           'Our company has been recognized with the prestigious Innovation in Medical Technology Award for 2023.',
  //       },
  //     ],
  //     author: { firstName: 'Anna', lastName: 'Kim' },
  //   },
  //   {
  //     id: '5',
  //     slug: 'research-breakthrough',
  //     status: 'published',
  //     viewsCount: 890,
  //     publishedAt: '2023-12-15T10:00:00Z',
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Breakthrough in Neural Interface Technology',
  //         excerpt:
  //           'Our research team has achieved a major breakthrough in neural interface technology, reducing response time by 40%.',
  //       },
  //     ],
  //     author: { firstName: 'Robert', lastName: 'Chen' },
  //   },
  //   {
  //     id: '6',
  //     slug: 'user-success-story',
  //     status: 'published',
  //     viewsCount: 1120,
  //     publishedAt: '2023-12-10T10:00:00Z',
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Inspiring Success Story: Sarah Returns to Piano',
  //         excerpt:
  //           'After losing her hand in an accident, Sarah thought she would never play piano again. Our bionic hand changed that.',
  //       },
  //     ],
  //     author: { firstName: 'Sarah', lastName: 'Martinez' },
  //   },
  // ];

  const getNewsTitle = (item: News) => {
    const enTranslation = item.translations?.find((t) => t.language === 'en');
    return enTranslation?.title || 'News Article';
  };

  const getNewsExcerpt = (item: News) => {
    const enTranslation = item.translations?.find((t) => t.language === 'en');
    return enTranslation?.excerpt || '';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && news.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Premium Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 30%, #1e293b 60%, #0f172a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 20s ease infinite',
          color: 'white',
          py: { xs: 10, md: 16 },
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 70% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            animation: 'float 25s ease-in-out infinite, morph 30s ease-in-out infinite',
            opacity: 0.8,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '60px 60px',
            animation: 'float 20s ease-in-out infinite',
            opacity: 0.6,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              animation: 'fadeInDown 0.8s ease-out',
              mb: 2,
            }}
          >
            <ArticleIcon sx={{ fontSize: 80, mb: 3, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }} />
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 900,
              mb: 3,
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              letterSpacing: '-0.02em',
            }}
          >
            {t('news.title')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              maxWidth: '700px',
              mx: 'auto',
              animation: 'fadeInUp 0.8s ease-out 0.4s both',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              lineHeight: 1.7,
            }}
          >
            {t('news.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error} - Showing sample news
          </Alert>
        )}

        {news.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              {t('news.noNews')}
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {news.map((item, index) => (
                <Grid item xs={12} md={index === 0 ? 12 : 6} lg={index === 0 ? 12 : 4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(26, 26, 36, 0.9) 0%, rgba(20, 20, 30, 0.9) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 255, 1) 100%)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 1,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.01)',
                        boxShadow: '0 16px 32px rgba(102, 126, 234, 0.2)',
                        borderColor: 'primary.main',
                        '&::before': {
                          transform: 'scaleX(1)',
                        },
                        '& .news-icon': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: index === 0 ? 420 : 220,
                        background: (theme) => theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        className="news-icon"
                        sx={{
                          fontSize: index === 0 ? '6rem' : '4rem',
                          opacity: 0.4,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.2))',
                        }}
                      >
                        📰
                      </Box>
                      <Chip
                        label="Published"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                          color: 'white',
                          fontWeight: 700,
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                          zIndex: 2,
                        }}
                      />
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                          }}
                        >
                          <CalendarIcon fontSize="small" sx={{ color: 'primary.main' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {formatDate(item.publishedAt)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                          }}
                        >
                          <VisibilityIcon fontSize="small" sx={{ color: 'primary.main' }} />
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {item.viewsCount} {t('news.views')}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant={index === 0 ? 'h4' : 'h6'}
                        fontWeight={700}
                        gutterBottom
                        sx={{ mb: 1.5, lineHeight: 1.3 }}
                      >
                        {getNewsTitle(item)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          display: '-webkit-box',
                          WebkitLineClamp: index === 0 ? 3 : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.7,
                        }}
                      >
                        {getNewsExcerpt(item)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontStyle: 'italic',
                          fontWeight: 500,
                        }}
                      >
                        By {item.author?.firstName} {item.author?.lastName}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        size="medium"
                        onClick={() => router.push(`/news/${item.slug}`)}
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        {t('news.readMore')} →
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

