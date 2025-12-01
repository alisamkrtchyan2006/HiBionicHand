'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1e40af', // Blue-800
      light: '#3b82f6', // Blue-500
      dark: '#1e3a8a', // Blue-900
      contrastText: '#fff',
    },
    secondary: {
      main: '#1e3a8a', // Blue-900
      light: '#2563eb', // Blue-600
      dark: '#1e293b', // Slate-800
      contrastText: '#fff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 900,
      letterSpacing: '-0.04em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 20,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 10px 15px rgba(0, 0, 0, 0.08)',
    '0 20px 25px rgba(0, 0, 0, 0.1)',
    '0 25px 50px rgba(0, 0, 0, 0.12)',
    '0 30px 60px rgba(0, 0, 0, 0.15)',
    '0 35px 70px rgba(0, 0, 0, 0.18)',
    '0 40px 80px rgba(0, 0, 0, 0.2)',
    '0 45px 90px rgba(0, 0, 0, 0.22)',
    '0 50px 100px rgba(0, 0, 0, 0.25)',
    '0 55px 110px rgba(0, 0, 0, 0.28)',
    '0 60px 120px rgba(0, 0, 0, 0.3)',
    '0 65px 130px rgba(0, 0, 0, 0.32)',
    '0 70px 140px rgba(0, 0, 0, 0.35)',
    '0 75px 150px rgba(0, 0, 0, 0.38)',
    '0 80px 160px rgba(0, 0, 0, 0.4)',
    '0 85px 170px rgba(0, 0, 0, 0.42)',
    '0 90px 180px rgba(0, 0, 0, 0.45)',
    '0 95px 190px rgba(0, 0, 0, 0.48)',
    '0 100px 200px rgba(0, 0, 0, 0.5)',
    '0 105px 210px rgba(0, 0, 0, 0.52)',
    '0 110px 220px rgba(0, 0, 0, 0.55)',
    '0 115px 230px rgba(0, 0, 0, 0.58)',
    '0 120px 240px rgba(0, 0, 0, 0.6)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 16,
          padding: '12px 32px',
          fontSize: '1rem',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
        },
        contained: {
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
          boxShadow: '0 8px 24px rgba(30, 64, 175, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #0f172a 100%)',
            boxShadow: '0 12px 32px rgba(30, 64, 175, 0.45)',
            transform: 'translateY(-2px) scale(1.02)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#1e40af',
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(30, 64, 175, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          background: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 12,
          height: 32,
          fontSize: '0.875rem',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'rgba(30, 64, 175, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

