'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchNews();
    }
  }, [slug]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/news/slug/${slug}?language=en`);
      setNews(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
      // Use dummy data on error
      setNews(getDummyNews());
    } finally {
      setLoading(false);
    }
  };

  const getDummyNews = () => ({
    id: '1',
    slug: slug,
    status: 'published',
    viewsCount: 1250,
    publishedAt: '2024-01-15T10:00:00Z',
    translations: [
      {
        language: 'en',
        title: 'Revolutionary New Bionic Hand Launched',
        content: `
          <p>We are excited to announce the launch of our latest bionic hand model featuring advanced AI capabilities and enhanced tactile feedback.</p>
          
          <p>After years of research and development, our team has created a breakthrough product that sets new standards in prosthetic technology. The new model includes:</p>
          
          <ul>
            <li>Advanced neural interface for intuitive control</li>
            <li>AI-powered learning algorithms that adapt to user patterns</li>
            <li>Enhanced tactile feedback sensors</li>
            <li>Extended battery life up to 16 hours</li>
            <li>Lightweight design at only 420g</li>
          </ul>
          
          <p>Clinical trials have shown exceptional results, with 95% of participants reporting significant improvement in daily activities. The new model will be available starting next month.</p>
          
          <p>We're proud to continue pushing the boundaries of what's possible in bionic technology, always with our users' needs at the forefront of our innovation.</p>
        `,
        excerpt: 'We are excited to announce the launch of our latest bionic hand model.',
      },
    ],
    author: {
      firstName: 'Alex',
      lastName: 'Petrov',
      email: 'alex@hibionichand.com',
    },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">News article not found</Alert>
      </Container>
    );
  }

  const newsTitle = news.translations?.find((t: any) => t.language === 'en')?.title || 'News Article';
  const newsContent = news.translations?.find((t: any) => t.language === 'en')?.content || '';

  return (
    <Box>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/news')}
          sx={{ mb: 4 }}
        >
          Back to News
        </Button>

        <Card>
          <Box
            sx={{
              height: 400,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box sx={{ fontSize: '8rem', opacity: 0.3 }}>
              📰
            </Box>
            <Chip
              label="Published"
              color="success"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
              }}
            />
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
            >
              {newsTitle}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                mb: 4,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {news.author?.firstName} {news.author?.lastName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(news.publishedAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {news.viewsCount} views
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box
              sx={{
                '& p': {
                  mb: 2,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                },
                '& ul': {
                  mb: 2,
                  pl: 3,
                },
                '& li': {
                  mb: 1,
                  lineHeight: 1.8,
                },
              }}
              dangerouslySetInnerHTML={{ __html: newsContent }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

