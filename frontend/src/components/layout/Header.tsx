'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = [
    { label: t('home'), path: '/' },
    { label: t('products'), path: '/products' },
    { label: t('news'), path: '/news' },
    { label: t('reviews'), path: '/reviews' },
    { label: t('partners'), path: '/partners' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contacts' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          hiBionicHand
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item, index) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => {
                router.push(item.path);
                setMobileOpen(false);
              }}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `fadeInLeft 0.4s ease-out ${index * 0.1}s both`,
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateX(8px)',
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 700,
                  },
                },
              }}
            >
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    transition: 'all 0.3s ease',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(15, 23, 42, 0.8)' 
            : 'rgba(255, 255, 255, 0.75)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(99, 102, 241, 0.2)'
            : 'rgba(99, 102, 241, 0.1)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'slideInFromTop 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 8px 32px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, px: { xs: 2, md: 4 } }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 900,
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 8s ease infinite',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                borderRadius: '2px',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              '&:hover': {
                transform: 'scale(1.08) translateY(-2px)',
                filter: 'brightness(1.15)',
                '&::after': {
                  width: '100%',
                },
              },
            }}
            onClick={() => router.push('/')}
          >
            hiBionicHand
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'rotate(90deg)',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navigationItems.map((item, index) => (
                <Button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  sx={{
                    color: pathname === item.path ? 'primary.main' : 'text.primary',
                    fontWeight: pathname === item.path ? 700 : 600,
                    position: 'relative',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      background: pathname === item.path
                        ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 58, 138, 0.1) 100%)'
                        : 'transparent',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: 0,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: pathname === item.path
                        ? 'translateX(-50%) scaleX(1)'
                        : 'translateX(-50%) scaleX(0)',
                      width: '60%',
                      height: '3px',
                      background: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)',
                      borderRadius: '2px',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 8px rgba(30, 64, 175, 0.4)',
                      zIndex: 1,
                    },
                    '&:hover': {
                      bgcolor: 'rgba(30, 64, 175, 0.08)',
                      transform: 'translateY(-3px)',
                      '&::before': {
                        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15) 0%, rgba(30, 58, 138, 0.15) 100%)',
                      },
                      '&::after': {
                        transform: 'translateX(-50%) scaleX(1)',
                      },
                    },
                    '& > *': {
                      position: 'relative',
                      zIndex: 1,
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Box sx={{ ml: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                <LanguageSwitcher />
                <ThemeToggle />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, rgba(26, 26, 36, 0.95) 0%, rgba(15, 15, 21, 0.95) 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 248, 248, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid',
            borderColor: 'divider',
            animation: 'fadeInLeft 0.3s ease-out',
          },
        }}
      >
        {drawer}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
            <LanguageSwitcher />
            <ThemeToggle />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

