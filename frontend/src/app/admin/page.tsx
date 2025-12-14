'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Article as ArticleIcon,
  RateReview as RateReviewIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';

interface DashboardStats {
  products: { total: number; published: number };
  news: { total: number; published: number };
  reviews: { total: number; approved: number; averageRating: number };
  partners: { total: number; active: number };
  users: { total: number; active: number };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    products: { total: 0, published: 0 },
    news: { total: 0, published: 0 },
    reviews: { total: 0, approved: 0, averageRating: 0 },
    partners: { total: 0, active: 0 },
    users: { total: 0, active: 0 },
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch stats from API
      const [productsRes, newsRes, reviewsRes, partnersRes] = await Promise.allSettled([
        apiClient.get('/products?limit=1'),
        apiClient.get('/news?limit=1'),
        apiClient.get('/reviews?limit=1'),
        apiClient.get('/partners?limit=1'),
      ]);

      // Extract counts from responses
      const products = productsRes.status === 'fulfilled' 
        ? productsRes.value.data.pagination?.total || 0 
        : 0;
      const news = newsRes.status === 'fulfilled' 
        ? newsRes.value.data.pagination?.total || 0 
        : 0;
      const reviews = reviewsRes.status === 'fulfilled' 
        ? reviewsRes.value.data.pagination?.total || 0 
        : 0;
      const partners = partnersRes.status === 'fulfilled' 
        ? partnersRes.value.data.pagination?.total || 0 
        : 0;

      setStats({
        products: { total: products, published: products },
        news: { total: news, published: news },
        reviews: { total: reviews, approved: reviews, averageRating: 4.8 },
        partners: { total: partners, active: partners },
        users: { total: 0, active: 0 },
      });
      setError(null);
    } catch (err: any) {
      setError('Failed to load dashboard statistics');
      // Use dummy data on error
      setStats({
        products: { total: 12, published: 10 },
        news: { total: 8, published: 6 },
        reviews: { total: 45, approved: 42, averageRating: 4.8 },
        partners: { total: 6, active: 6 },
        users: { total: 5, active: 5 },
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Products',
      value: stats.products.total,
      subtitle: `${stats.products.published} published`,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: 'primary',
      path: '/admin/products',
    },
    {
      title: 'News Articles',
      value: stats.news.total,
      subtitle: `${stats.news.published} published`,
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: 'secondary',
      path: '/admin/news',
    },
    {
      title: 'Reviews',
      value: stats.reviews.total,
      subtitle: `${stats.reviews.approved} approved • ${stats.reviews.averageRating.toFixed(1)} avg rating`,
      icon: <RateReviewIcon sx={{ fontSize: 40 }} />,
      color: 'success',
      path: '/admin/reviews',
    },
    {
      title: 'Partners',
      value: stats.partners.total,
      subtitle: `${stats.partners.active} active`,
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: 'info',
      path: '/admin/partners',
    },
    {
      title: 'Team Members',
      value: stats.users.total,
      subtitle: `${stats.users.active} active`,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: 'warning',
      path: '/admin/team',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the hiBionicHand Admin Panel
      </Typography>

      {error && (
        <Alert severity="info" sx={{ mb: 4 }}>
          {error} - Showing sample statistics
        </Alert>
      )}

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => router.push(card.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: `${card.color}.main`,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" fontWeight={700}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Typography variant="h6" fontWeight={600}>
                Quick Actions
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Use the sidebar navigation to manage products, news, reviews, partners, and team members.
              Click on any statistic card above to navigate directly to that section.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

