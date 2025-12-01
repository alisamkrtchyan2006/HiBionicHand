'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Science as ScienceIcon,
  Star as StarIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

// Placeholder dummy data
const revolutionaryTech = [
  {
    id: 1,
    titleKey: 'tech.neuralInterface',
    descriptionKey: 'tech.neuralInterfaceDesc',
    icon: '🧠',
  },
  {
    id: 2,
    titleKey: 'tech.precisionSensors',
    descriptionKey: 'tech.precisionSensorsDesc',
    icon: '👆',
  },
  {
    id: 3,
    titleKey: 'tech.aiLearning',
    descriptionKey: 'tech.aiLearningDesc',
    icon: '🤖',
  },
  {
    id: 4,
    titleKey: 'tech.lightweight',
    descriptionKey: 'tech.lightweightDesc',
    icon: '⚡',
  },
];

const reviews = [
  {
    id: 1,
    authorName: 'Sarah Johnson',
    rating: 5,
    contentKey: 'reviews.sarah',
    product: 'Bionic Hand Pro',
  },
  {
    id: 2,
    authorName: 'Michael Chen',
    rating: 5,
    contentKey: 'reviews.michael',
    product: 'Bionic Hand Elite',
  },
  {
    id: 3,
    authorName: 'Emma Williams',
    rating: 5,
    contentKey: 'reviews.emma',
    product: 'Bionic Hand Pro',
  },
];

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Alex Petrov',
    roleKey: 'team.leadEngineer',
    bioKey: 'team.leadEngineerBio',
  },
  {
    id: 2,
    name: 'Dr. Maria Garcia',
    roleKey: 'team.neuralSpecialist',
    bioKey: 'team.neuralSpecialistBio',
  },
  {
    id: 3,
    name: 'James Wilson',
    roleKey: 'team.designer',
    bioKey: 'team.designerBio',
  },
  {
    id: 4,
    name: 'Dr. Anna Kim',
    roleKey: 'team.researchDirector',
    bioKey: 'team.researchDirectorBio',
  },
];

export default function HomePage() {
  const t = useTranslations();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box>
      {/* Premium Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 30%, #1e293b 60%, #0f172a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient 20s ease infinite',
          color: 'white',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
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
            background: 
              'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '60px 60px',
            animation: 'float 20s ease-in-out infinite',
            opacity: 0.6,
          },
        }}
      >
        {/* Animated Blob Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animation: 'morph 20s ease-in-out infinite, float 15s ease-in-out infinite',
            filter: 'blur(60px)',
            opacity: 0.6,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            animation: 'morph 25s ease-in-out infinite, float 18s ease-in-out infinite',
            filter: 'blur(50px)',
            opacity: 0.5,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 900,
                  mb: 3,
                  lineHeight: 1.2,
                  animation: isVisible ? 'fadeInUp 1s ease-out' : 'none',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('home.title')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 4,
                  opacity: 0.95,
                  lineHeight: 1.7,
                  animation: isVisible ? 'fadeInUp 1s ease-out 0.2s both' : 'none',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                {t('home.slogan')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<ExploreIcon />}
                onClick={() => router.push('/products')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#1e40af',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(30, 64, 175, 0.3)',
                  animation: isVisible ? 'fadeInUp 1s ease-out 0.4s both' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(30, 64, 175, 0.2), transparent)',
                    transition: 'left 0.6s',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    padding: '2px',
                    background: 'linear-gradient(135deg, #1e40af, #1e3a8a, #1e293b)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.4s',
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                    transform: 'translateY(-6px) scale(1.05)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(30, 64, 175, 0.4)',
                    '&::before': {
                      left: '100%',
                    },
                    '&::after': {
                      opacity: 1,
                    },
                  },
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {t('home.exploreProducts')}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '400px', md: '600px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: isVisible ? 'fadeInRight 1s ease-out 0.3s both' : 'none',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent 30%)',
                      animation: 'rotate 10s linear infinite',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '80%',
                      height: '80%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                      borderRadius: '50%',
                      position: 'relative',
                      zIndex: 1,
                      animation: 'float 6s ease-in-out infinite',
                      boxShadow: '0 0 80px rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '8rem',
                        filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))',
                        animation: 'float 4s ease-in-out infinite',
                        zIndex: 2,
                      }}
                    >
                      🤖
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Revolutionary Technology Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<ScienceIcon />}
              label={t('home.revolutionaryTech')}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              {t('home.revolutionaryTech')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              {t('home.revolutionaryTechDesc')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {revolutionaryTech.map((tech, index) => (
              <Grid item xs={12} sm={6} md={3} key={tech.id}>
                <Card
                  className="card-glow"
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 5,
                    position: 'relative',
                    overflow: 'hidden',
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                    border: '2px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(30, 64, 175, 0.2)'
                      : 'rgba(30, 64, 175, 0.1)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                    boxShadow: '0 8px 32px rgba(30, 64, 175, 0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                      backgroundSize: '200% 100%',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: 'gradient 3s ease infinite',
                    },
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.03)',
                      boxShadow: '0 24px 64px rgba(30, 64, 175, 0.25), 0 8px 16px rgba(30, 58, 138, 0.2)',
                      borderColor: 'primary.main',
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                      '& .tech-icon': {
                        transform: 'scale(1.25) rotate(8deg)',
                        filter: 'drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4))',
                      },
                    },
                  }}
                >
                  <Box
                    className="tech-icon"
                    sx={{
                      fontSize: '5rem',
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: 'drop-shadow(0 6px 12px rgba(30, 64, 175, 0.3))',
                      animation: 'float 6s ease-in-out infinite',
                    }}
                  >
                    {tech.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    gutterBottom
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {t(tech.titleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
                    {t(tech.descriptionKey)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* User Reviews Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<StarIcon />}
              label={t('home.userReviews')}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              {t('home.userReviews')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              {t('home.userReviewsDesc')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {reviews.map((review, index) => (
              <Grid item xs={12} md={4} key={review.id}>
                <Card
                  className="card-glow"
                  sx={{
                    height: '100%',
                    p: 4.5,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                    border: '2px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(99, 102, 241, 0.2)'
                      : 'rgba(99, 102, 241, 0.1)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`,
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.12)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '5px',
                      height: '100%',
                      background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                      backgroundSize: '100% 200%',
                      transform: 'scaleY(0)',
                      transformOrigin: 'top',
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: 'gradient 3s ease infinite',
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 24px 64px rgba(30, 64, 175, 0.2), 0 8px 16px rgba(30, 58, 138, 0.15)',
                      borderColor: 'primary.main',
                      '&::before': {
                        transform: 'scaleY(1)',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Avatar
                      sx={{
                        width: 72,
                        height: 72,
                        mr: 2.5,
                        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        boxShadow: '0 8px 24px rgba(30, 64, 175, 0.4), 0 4px 12px rgba(30, 58, 138, 0.3)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '3px solid rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)',
                          boxShadow: '0 12px 32px rgba(99, 102, 241, 0.5)',
                        },
                      }}
                    >
                      {review.authorName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                        {review.authorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {review.product}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating
                    value={review.rating}
                    readOnly
                    sx={{
                      mb: 2.5,
                      '& .MuiRating-iconFilled': {
                        color: '#ffc107',
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      mb: 2.5,
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      color: 'text.primary',
                      position: 'relative',
                      pl: 3,
                      fontSize: '1.05rem',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                        borderRadius: '2px',
                        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.4)',
                      },
                    }}
                  >
                    "{t(review.contentKey)}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/reviews')}
              sx={{ px: 4 }}
            >
              {t('common.viewAll')} {t('common.reviews')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Meet Our Team Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              icon={<PeopleIcon />}
              label={t('home.meetTeam')}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              {t('home.meetTeam')}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              {t('home.meetTeamDesc')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 255, 1) 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `scaleIn 0.8s ease-out ${index * 0.15}s both`,
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
                      borderColor: 'primary.main',
                      '& .team-avatar': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                      },
                    },
                  }}
                >
                  <Avatar
                    className="team-avatar"
                    sx={{
                      width: 140,
                      height: 140,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                      border: '5px solid',
                      borderColor: 'primary.light',
                      fontSize: '3rem',
                      fontWeight: 800,
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {t(member.roleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {t(member.bioKey)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

