'use client';

/**
 * Translation Usage Examples
 * 
 * This component demonstrates how to use translations in your components
 */

import { useTranslations } from 'next-intl';
import { Box, Typography, Paper, Button } from '@mui/material';

export default function TranslationExample() {
  // Basic translation hook
  const t = useTranslations();

  // Namespaced translation (recommended)
  const tCommon = useTranslations('common');
  const tHome = useTranslations('home');
  const tProducts = useTranslations('products');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Translation Usage Examples
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example 1: Basic Translation
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('common.home')} - {t('common.products')} - {t('common.news')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Usage: const t = useTranslations(); t('common.home')
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example 2: Namespaced Translation
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {tCommon('home')} - {tHome('title')} - {tProducts('title')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Usage: const tCommon = useTranslations('common'); tCommon('home')
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example 3: In Buttons
        </Typography>
        <Button variant="contained" sx={{ mr: 2 }}>
          {tCommon('save')}
        </Button>
        <Button variant="outlined">
          {tCommon('cancel')}
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example 4: Complex Text
        </Typography>
        <Typography variant="body1">
          {tHome('slogan')}
        </Typography>
      </Paper>
    </Box>
  );
}

