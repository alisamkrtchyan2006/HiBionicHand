'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        background: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0f172a 0%, #020617 100%)'
          : 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'rgba(255, 255, 255, 0.9)',
        py: 10,
        mt: 'auto',
        borderTop: '2px solid',
        borderColor: 'rgba(30, 64, 175, 0.3)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(30, 64, 175, 0.6), rgba(30, 58, 138, 0.6), transparent)',
          animation: 'shimmer 3s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 20s ease-in-out infinite',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              fontWeight={900}
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(59, 130, 246, 1) 50%, rgba(30, 64, 175, 1) 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 3,
                animation: 'fadeInUp 0.8s ease-out, gradient 8s ease infinite',
                fontSize: '1.5rem',
                letterSpacing: '-0.02em',
              }}
              gutterBottom
            >
              hiBionicHand
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                lineHeight: 1.7,
                opacity: 0.9,
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
            >
              Redefining human potential through advanced bionic technology.
              Empowering lives with cutting-edge prosthetic solutions.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                animation: 'fadeInUp 0.8s ease-out 0.4s both',
              }}
            >
              {[
                { icon: <FacebookIcon />, color: '#1877F2' },
                { icon: <TwitterIcon />, color: '#1DA1F2' },
                { icon: <LinkedInIcon />, color: '#0077B5' },
                { icon: <InstagramIcon />, color: '#E4405F' },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  size="medium"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                    '&:hover': {
                      color: 'white',
                      bgcolor: social.color,
                      borderColor: social.color,
                      transform: 'translateY(-6px) scale(1.15) rotate(5deg)',
                      boxShadow: `0 12px 24px ${social.color}60, 0 4px 8px ${social.color}40`,
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: 'white',
                mb: 3,
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
              gutterBottom
            >
              Quick Links
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                animation: 'fadeInUp 0.8s ease-out 0.4s both',
              }}
            >
              {[
                { label: 'Products', href: '/products' },
                { label: 'News', href: '/news' },
                { label: 'Reviews', href: '/reviews' },
                { label: 'Partners', href: '/partners' },
                { label: 'Contact Us', href: '/contacts' },
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    display: 'inline-block',
                    width: 'fit-content',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%)',
                      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover': {
                      color: 'white',
                      transform: 'translateX(8px)',
                      '&::after': {
                        width: '100%',
                      },
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: 'white',
                mb: 3,
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
              gutterBottom
            >
              Contact
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                animation: 'fadeInUp 0.8s ease-out 0.4s both',
              }}
            >
              {[
                { label: 'Email', value: 'info@hibionichand.com' },
                { label: 'Phone', value: '+1 (555) 123-4567' },
                { label: 'Address', value: '123 Innovation Drive, Tech City, TC 12345' },
              ].map((contact, index) => (
                <Box
                  key={contact.label}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 0.5,
                      display: 'block',
                    }}
                  >
                    {contact.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 500,
                    }}
                  >
                    {contact.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            mt: 6,
            pt: 4,
            textAlign: 'center',
            position: 'relative',
            animation: 'fadeInUp 0.8s ease-out 0.6s both',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 500,
            }}
          >
            © {currentYear} hiBionicHand. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

