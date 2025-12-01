'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Pagination,
} from '@mui/material';
import {
  RateReview as RateReviewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';
import { useTranslations } from 'next-intl';

interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  rating: number;
  status: string;
  isFeatured: boolean;
  productId?: string;
  product?: {
    translations: Array<{
      language: string;
      name: string;
    }>;
  };
  translations: Array<{
    language: string;
    title?: string;
    content: string;
  }>;
  createdAt: string;
}

export default function ReviewsPage() {
  const t = useTranslations();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'featured'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: [] as Array<{ rating: number; count: number }>,
  });

  useEffect(() => {
    fetchReviews();
  }, [filter, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
        language: 'en',
        status: filter === 'all' ? 'approved' : filter,
      };
      if (filter === 'featured') {
        params.isFeatured = true;
      }
      const response = await apiClient.get('/reviews', { params });
      setReviews(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
      // Use dummy data on error
      // setReviews(getDummyReviews());
      setTotalPages(1);
      setStats({
        average: 4.8,
        total: 150,
        distribution: [
          { rating: 5, count: 120 },
          { rating: 4, count: 25 },
          { rating: 3, count: 4 },
          { rating: 2, count: 1 },
          { rating: 1, count: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // const getDummyReviews = (): Review[] => [
  //   {
  //     id: '1',
  //     authorName: 'Sarah Johnson',
  //     rating: 5,
  //     status: 'approved',
  //     isFeatured: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Life Changing Experience',
  //         content:
  //           'This bionic hand has completely transformed my life. The precision and natural feel are incredible! I can now perform tasks I thought were impossible. The support team is amazing too.',
  //       },
  //     ],
  //     createdAt: '2024-01-15T10:00:00Z',
  //     product: {
  //       translations: [{ language: 'en', name: 'Bionic Hand Pro' }],
  //     },
  //   },
  //   {
  //     id: '2',
  //     authorName: 'Michael Chen',
  //     rating: 5,
  //     status: 'approved',
  //     isFeatured: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Revolutionary Technology',
  //         content:
  //           'The technology is truly revolutionary. The neural interface works flawlessly, and the AI learning adapts to my movements perfectly. Highly recommend!',
  //       },
  //     ],
  //     createdAt: '2024-01-10T10:00:00Z',
  //     product: {
  //       translations: [{ language: 'en', name: 'Bionic Hand Elite' }],
  //     },
  //   },
  //   {
  //     id: '3',
  //     authorName: 'Emma Williams',
  //     rating: 5,
  //     status: 'approved',
  //     isFeatured: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         title: 'Exceeded Expectations',
  //         content:
  //           'Amazing product! The team support and the quality of the device exceeded all my expectations. I feel like I have my hand back.',
  //       },
  //     ],
  //     createdAt: '2024-01-05T10:00:00Z',
  //     product: {
  //       translations: [{ language: 'en', name: 'Bionic Hand Pro' }],
  //     },
  //   },
  //   {
  //     id: '4',
  //     authorName: 'David Thompson',
  //     rating: 5,
  //     status: 'approved',
  //     isFeatured: false,
  //     translations: [
  //       {
  //         language: 'en',
  //         content:
  //           'After years of using traditional prosthetics, this is a game changer. The tactile feedback is remarkable.',
  //       },
  //     ],
  //     createdAt: '2023-12-20T10:00:00Z',
  //   },
  //   {
  //     id: '5',
  //     authorName: 'Lisa Anderson',
  //     rating: 4,
  //     status: 'approved',
  //     isFeatured: false,
  //     translations: [
  //       {
  //         language: 'en',
  //         content:
  //           'Great product overall. The learning curve was a bit steep, but the support team helped me through it. Very satisfied!',
  //       },
  //     ],
  //     createdAt: '2023-12-15T10:00:00Z',
  //   },
  //   {
  //     id: '6',
  //     authorName: 'Robert Martinez',
  //     rating: 5,
  //     status: 'approved',
  //     isFeatured: false,
  //     translations: [
  //       {
  //         language: 'en',
  //         content:
  //           'The best investment I\'ve made. The quality and functionality are outstanding. Thank you hiBionicHand!',
  //       },
  //     ],
  //     createdAt: '2023-12-10T10:00:00Z',
  //   },
  // ];

  const getReviewContent = (review: Review) => {
    const enTranslation = review.translations?.find((t) => t.language === 'en');
    return enTranslation?.content || '';
  };

  const getReviewTitle = (review: Review) => {
    const enTranslation = review.translations?.find((t) => t.language === 'en');
    return enTranslation?.title;
  };

  const getProductName = (review: Review) => {
    return review.product?.translations?.find((t) => t.language === 'en')?.name || 'Product';
  };

  const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
    setFilter(newValue as any);
    setPage(1);
  };

  if (loading && reviews.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ animation: 'fadeInDown 0.8s ease-out', mb: 2 }}>
            <RateReviewIcon sx={{ fontSize: 80, mb: 3, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }} />
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
            {t('reviews.title')}
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
            {t('reviews.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error} - Showing sample reviews
          </Alert>
        )} */}

        {/* Statistics */}
        {stats.total > 0 && (
          <Box
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'grey.50',
              p: 4,
              borderRadius: 2,
              mb: 6,
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {stats.average.toFixed(1)}
                </Typography>
                <Rating value={stats.average} readOnly precision={0.1} size="large" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('reviews.averageRating')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('reviews.totalReviews')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  {stats.distribution.map((dist) => (
                    <Box key={dist.rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: 80 }}>
                        <StarIcon sx={{ fontSize: 16, color: 'gold', mr: 0.5 }} />
                        <Typography variant="body2">{dist.rating}</Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1, mx: 2 }}>
                        <Box
                          sx={{
                            height: 8,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.300',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: 'primary.main',
                              width: `${(dist.count / stats.total) * 100}%`,
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ width: 40, textAlign: 'right' }}>
                        {dist.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Filter Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={filter}
            onChange={handleFilterChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tab label={t('reviews.allReviews')} value="all" />
            <Tab label={t('reviews.approved')} value="approved" />
            <Tab label={t('reviews.featured')} value="featured" />
          </Tabs>
        </Box>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
            {t('reviews.noReviews')}
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {reviews.map((review, index) => (
                <Grid item xs={12} md={6} key={review.id}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3.5,
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
                        width: '4px',
                        height: '100%',
                        background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)',
                        transform: 'scaleY(0)',
                        transformOrigin: 'top',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 16px 32px rgba(102, 126, 234, 0.2)',
                        borderColor: 'primary.main',
                        '&::before': {
                          transform: 'scaleY(1)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        src={review.authorAvatarUrl}
                        alt={review.authorName}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      >
                        {review.authorName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.authorName}
                        </Typography>
                        {review.productId && (
                          <Typography variant="caption" color="text.secondary">
                            {getProductName(review)}
                          </Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      {review.isFeatured && (
                        <Chip label="Featured" color="primary" size="small" />
                      )}
                    </Box>
                    {getReviewTitle(review) && (
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {getReviewTitle(review)}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                      "{getReviewContent(review)}"
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
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

