'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/slug/${slug}?language=en`);
      setProduct(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      // Use dummy data on error
      setProduct(getDummyProduct());
    } finally {
      setLoading(false);
    }
  };

  const getDummyProduct = () => ({
    id: '1',
    slug: slug,
    type: 'upper_limb',
    status: 'published',
    translations: [
      {
        language: 'en',
        name: 'Bionic Hand Pro',
        description:
          'Our flagship product featuring advanced neural interface technology, precision sensors, and AI-powered learning capabilities. The Bionic Hand Pro represents the pinnacle of prosthetic technology, offering users unprecedented control and natural movement.',
        shortDescription: 'Advanced bionic hand with neural control',
      },
    ],
    specs: [
      { specKey: 'Fingers', specValue: '5 independent fingers with individual control' },
      { specKey: 'Weight', specValue: '450g (lightweight design)' },
      { specKey: 'Battery Life', specValue: '12 hours of continuous use' },
      { specKey: 'Control Method', specValue: 'Neural interface with AI learning' },
      { specKey: 'Tactile Feedback', specValue: 'Advanced pressure and temperature sensors' },
      { specKey: 'Materials', specValue: 'Medical-grade titanium and carbon fiber' },
      { specKey: 'Water Resistance', specValue: 'IP67 rated' },
      { specKey: 'Warranty', specValue: '2 years comprehensive warranty' },
    ],
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  const productName = product.translations?.find((t: any) => t.language === 'en')?.name || 'Product';
  const productDescription = product.translations?.find((t: any) => t.language === 'en')?.description || '';

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/products')}
          sx={{ mb: 4 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={6}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: { xs: 400, md: 600 },
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.200',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ fontSize: '12rem', opacity: 0.3 }}>
                🤖
              </Box>
              <Chip
                label={product.type?.replace('_', ' ').toUpperCase()}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                }}
              />
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {productName}
            </Typography>
            <Chip
              label={product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
              color="success"
              sx={{ mb: 3 }}
            />
            <Typography
              variant="body1"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}
            >
              {productDescription}
            </Typography>

            {/* Key Features */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Key Features
              </Typography>
              <Grid container spacing={2}>
                {[
                  'Neural Interface Control',
                  'AI-Powered Learning',
                  'Tactile Feedback',
                  'Lightweight Design',
                  'Long Battery Life',
                  'Water Resistant',
                ].map((feature, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                        }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Request Information
            </Button>
          </Grid>

          {/* Specifications */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Technical Specifications
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      {product.specs?.map((spec: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            sx={{
                              fontWeight: 600,
                              width: '30%',
                              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'grey.50',
                            }}
                          >
                            {spec.specKey}
                          </TableCell>
                          <TableCell>{spec.specValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

