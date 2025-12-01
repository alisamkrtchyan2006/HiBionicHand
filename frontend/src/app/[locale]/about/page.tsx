'use client';

import { useTranslations } from 'next-intl';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import {
  History as HistoryIcon,
  Flag as FlagIcon,
  RocketLaunch as RocketIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Alex Petrov',
    roleKey: 'team.leadEngineer',
    bioKey: 'team.leadEngineerBio',
    expertise: 'Neural Interfaces',
  },
  {
    id: 2,
    name: 'Dr. Maria Garcia',
    roleKey: 'team.neuralSpecialist',
    bioKey: 'team.neuralSpecialistBio',
    expertise: 'BCI Technology',
  },
  {
    id: 3,
    name: 'James Wilson',
    roleKey: 'team.designer',
    bioKey: 'team.designerBio',
    expertise: 'UX/UI Design',
  },
  {
    id: 4,
    name: 'Dr. Anna Kim',
    roleKey: 'team.researchDirector',
    bioKey: 'team.researchDirectorBio',
    expertise: 'Biomedical Research',
  },
];

const milestones = [
  { year: '2018', titleKey: 'milestones.foundation', descKey: 'milestones.foundationDesc' },
  { year: '2019', titleKey: 'milestones.prototype', descKey: 'milestones.prototypeDesc' },
  { year: '2020', titleKey: 'milestones.trials', descKey: 'milestones.trialsDesc' },
  { year: '2021', titleKey: 'milestones.launch', descKey: 'milestones.launchDesc' },
  { year: '2022', titleKey: 'milestones.expansion', descKey: 'milestones.expansionDesc' },
  { year: '2023', titleKey: 'milestones.ai', descKey: 'milestones.aiDesc' },
  { year: '2024', titleKey: 'milestones.nextGen', descKey: 'milestones.nextGenDesc' },
];

export default function AboutPage() {
  const t = useTranslations();

  return (
    <Box>
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
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 900,
              mb: 3,
              animation: 'fadeInUp 0.8s ease-out',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              letterSpacing: '-0.02em',
            }}
          >
            {t('about.title')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.95,
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              lineHeight: 1.7,
            }}
          >
            {t('about.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 10 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <HistoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {t('about.history')}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
            {t('about.historyDesc')}
          </Typography>

          <Grid container spacing={3}>
            {milestones.map((milestone, index) => (
              <Grid item xs={12} md={6} key={milestone.year}>
                <Card
                  sx={{
                    height: '100%',
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
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 16px 32px rgba(102, 126, 234, 0.2)',
                      borderColor: 'primary.main',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                    },
                  }}
                >
                  <CardContent>
                    <Chip
                      label={milestone.year}
                      color="primary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {t(milestone.titleKey)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(milestone.descKey)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <FlagIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {t('about.purpose')}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            {t('about.purposeDesc')}
          </Typography>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <RocketIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {t('about.mission')}
            </Typography>
          </Box>
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
              color: 'white',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {t('about.missionDesc')}
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {t('about.team')}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 6, maxWidth: '800px' }}
          >
            {t('about.teamDesc')}
          </Typography>
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
                      ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 255, 1) 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `scaleIn 0.8s ease-out ${index * 0.15}s both`,
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(30, 64, 175, 0.25)',
                      borderColor: 'primary.main',
                      '& .team-avatar': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 8px 24px rgba(30, 64, 175, 0.4)',
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
                      boxShadow: '0 8px 20px rgba(30, 64, 175, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
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
                    gutterBottom
                  >
                    {t(member.roleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(member.bioKey)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

