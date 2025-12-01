'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';
import { useTranslations } from 'next-intl';

interface Partner {
  id: string;
  name: string;
  websiteUrl: string | null;
  logo?: {
    url: string;
  };
  isActive: boolean;
  translations: Array<{
    language: string;
    description: string;
  }>;
}

export default function PartnersPage() {
  const t = useTranslations();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/partners', {
        params: {
          page: 1,
          limit: 50,
          language: 'en',
          isActive: true,
        },
      });
      setPartners(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch partners');
      // Use dummy data on error
      // setPartners(getDummyPartners());
    } finally {
      setLoading(false);
    }
  };

  // const getDummyPartners = (): Partner[] => [
  //   {
  //     id: '1',
  //     name: 'Global Medical Institute',
  //     websiteUrl: 'https://example.com',
  //     isActive: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         description:
  //           'Leading medical research institution specializing in prosthetics and rehabilitation.',
  //       },
  //     ],
  //   },
  //   {
  //     id: '2',
  //     name: 'NeuralTech Solutions',
  //     websiteUrl: 'https://example.com',
  //     isActive: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         description:
  //           'Pioneering neural interface technology and brain-computer interface systems.',
  //       },
  //     ],
  //   },
  //   {
  //     id: '3',
  //     name: 'Advanced Prosthetics Foundation',
  //     websiteUrl: 'https://example.com',
  //     isActive: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         description:
  //           'Non-profit organization dedicated to making advanced prosthetics accessible worldwide.',
  //       },
  //     ],
  //   },
  //   {
  //     id: '4',
  //     name: 'Biomedical Engineering Lab',
  //     websiteUrl: 'https://example.com',
  //     isActive: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         description:
  //           'University research lab focused on developing next-generation bionic devices.',
  //       },
  //     ],
  //   },
  //   {
  //     id: '5',
  //     name: 'International Rehabilitation Center',
  //     websiteUrl: 'https://example.com',
  //     isActive: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         description:
  //           'World-class rehabilitation facility providing comprehensive care for amputees.',
  //       },
  //     ],
  //   },
  //   {
  //     id: '6',
  //     name: 'Tech Innovation Hub',
  //     websiteUrl: 'https://example.com',
  //     isActive: true,
  //     translations: [
  //       {
  //         language: 'en',
  //         description:
  //           'Innovation center supporting startups and research in medical technology.',
  //       },
  //     ],
  //   },
  // ];

  const getPartnerDescription = (partner: Partner) => {
    const enTranslation = partner.translations?.find((t) => t.language === 'en');
    return enTranslation?.description || '';
  };

  if (loading && partners.length === 0) {
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
            background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ animation: 'fadeInDown 0.8s ease-out', mb: 2 }}>
            <BusinessIcon sx={{ fontSize: 80, mb: 3, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }} />
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
            {t('partners.title')}
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
            {t('partners.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error} - Showing sample partners
          </Alert>
        )} */}

        {partners.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
            {t('partners.noPartners')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {partners.map((partner, index) => (
              <Grid item xs={12} sm={6} md={4} key={partner.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(26, 26, 36, 0.9) 0%, rgba(20, 20, 30, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 255, 1) 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `scaleIn 0.8s ease-out ${index * 0.1}s both`,
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
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
                      borderColor: 'primary.main',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 120,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      borderRadius: 1,
                    }}
                  >
                    {partner.logo?.url ? (
                      <Box
                        component="img"
                        src={partner.logo.url}
                        alt={partner.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <BusinessIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                    )}
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1, p: 0 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {partner.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, minHeight: 60 }}
                    >
                      {getPartnerDescription(partner)}
                    </Typography>
                    {partner.websiteUrl && (
                      <Link
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <LanguageIcon fontSize="small" />
                        {t('partners.visitWebsite')}
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

