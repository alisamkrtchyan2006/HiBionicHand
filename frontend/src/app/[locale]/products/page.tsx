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
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';
import { useTranslations } from 'next-intl';

interface Product {
  id: string;
  slug: string;
  type: string;
  status: string;
  featuredImage?: {
    url: string;
  };
  translations: Array<{
    language: string;
    name: string;
    description: string;
    shortDescription: string;
  }>;
  specs: Array<{
    specKey: string;
    specValue: string;
  }>;
}

export default function ProductsPage() {
  const router = useRouter();
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upper_limb' | 'lower_limb'>('all');

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 20,
        language: 'en',
        status: 'published',
      };
      if (filter !== 'all') {
        params.type = filter;
      }
      const response = await apiClient.get('/products', { params });
      setProducts(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      // Use dummy data on error
      // setProducts(getDummyProducts());
    } finally {
      setLoading(false);
    }
  };

  // const getDummyProducts = (): Product[] => [
  //   {
  //     id: '1',
  //     slug: 'bionic-hand-pro',
  //     type: 'upper_limb',
  //     status: 'published',
  //     translations: [
  //       {
  //         language: 'en',
  //         name: 'Bionic Hand Pro',
  //         description:
  //           'Our flagship product featuring advanced neural interface technology, precision sensors, and AI-powered learning capabilities.',
  //         shortDescription: 'Advanced bionic hand with neural control',
  //       },
  //     ],
  //     specs: [
  //       { specKey: 'Fingers', specValue: '5 independent fingers' },
  //       { specKey: 'Weight', specValue: '450g' },
  //       { specKey: 'Battery Life', specValue: '12 hours' },
  //       { specKey: 'Control', specValue: 'Neural interface' },
  //     ],
  //   },
  //   {
  //     id: '2',
  //     slug: 'bionic-hand-elite',
  //     type: 'upper_limb',
  //     status: 'published',
  //     translations: [
  //       {
  //         language: 'en',
  //         name: 'Bionic Hand Elite',
  //         description:
  //           'Premium model with enhanced tactile feedback, extended battery life, and superior build quality for professional use.',
  //         shortDescription: 'Premium bionic hand with enhanced features',
  //       },
  //     ],
  //     specs: [
  //       { specKey: 'Fingers', specValue: '5 independent fingers' },
  //       { specKey: 'Weight', specValue: '420g' },
  //       { specKey: 'Battery Life', specValue: '16 hours' },
  //       { specKey: 'Control', specValue: 'Advanced neural interface' },
  //     ],
  //   },
  //   {
  //     id: '3',
  //     slug: 'bionic-leg-advanced',
  //     type: 'lower_limb',
  //     status: 'published',
  //     translations: [
  //       {
  //         language: 'en',
  //         name: 'Bionic Leg Advanced',
  //         description:
  //           'State-of-the-art lower limb prosthesis with adaptive walking algorithms and natural gait patterns.',
  //         shortDescription: 'Advanced bionic leg with adaptive walking',
  //       },
  //     ],
  //     specs: [
  //       { specKey: 'Type', specValue: 'Below knee' },
  //       { specKey: 'Weight', specValue: '1.2kg' },
  //       { specKey: 'Battery Life', specValue: '24 hours' },
  //       { specKey: 'Control', specValue: 'AI-powered adaptive' },
  //     ],
  //   },
  // ];

  const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
    setFilter(newValue as any);
  };

  const getProductImage = (product: Product) => {
    if (product.featuredImage?.url) {
      return product.featuredImage.url;
    }
    return '/assets/images/product-placeholder.jpg';
  };

  const getProductName = (product: Product) => {
    const enTranslation = product.translations?.find((t) => t.language === 'en');
    return enTranslation?.name || 'Product';
  };

  const getProductDescription = (product: Product) => {
    const enTranslation = product.translations?.find((t) => t.language === 'en');
    return enTranslation?.shortDescription || enTranslation?.description || '';
  };

  if (loading && products.length === 0) {
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
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
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
            <InventoryIcon sx={{ fontSize: 80, mb: 3, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }} />
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
            {t('products.title')}
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
            {t('products.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error} - Showing sample products
          </Alert>
        )} */}

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
            <Tab label={t('products.allProducts')} value="all" />
            <Tab label={t('products.upperLimb')} value="upper_limb" />
            <Tab label={t('products.lowerLimb')} value="lower_limb" />
          </Tabs>
        </Box>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
            {t('products.noProducts')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} md={6} lg={4} key={product.id}>
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
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
                      borderColor: 'primary.main',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                      '& .product-icon': {
                        transform: 'scale(1.2) rotate(10deg)',
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 280,
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
                      className="product-icon"
                      sx={{
                        fontSize: '7rem',
                        opacity: 0.4,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.2))',
                      }}
                    >
                      🤖
                    </Box>
                    <Chip
                      label={product.type.replace('_', ' ').toUpperCase()}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                        color: 'white',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        zIndex: 2,
                      }}
                    />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
                      {getProductName(product)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                      {getProductDescription(product)}
                    </Typography>

                    {/* Key Specs */}
                    <Box sx={{ mt: 2.5 }}>
                      {product.specs?.slice(0, 3).map((spec, specIndex) => (
                        <Box
                          key={specIndex}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            py: 1,
                            px: 1.5,
                            mb: 0.5,
                            borderRadius: 1,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.05)' : 'rgba(102, 126, 234, 0.03)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.06)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {spec.specKey}:
                          </Typography>
                          <Typography variant="caption" fontWeight={700} color="primary.main">
                            {spec.specValue}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ExploreIcon />}
                      onClick={() => router.push(`/products/${product.slug}`)}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                        },
                      }}
                    >
                      {t('products.viewDetails')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

