'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { apiClient } from '@/lib/api/client';

interface Translation {
  language: 'en' | 'ru' | 'arm';
  description: string;
}

interface PartnerFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PartnerForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: PartnerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [name, setName] = useState('');
  const [logoId, setLogoId] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [translations, setTranslations] = useState<Translation[]>([
    { language: 'en', description: '' },
    { language: 'ru', description: '' },
    { language: 'arm', description: '' },
  ]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLogoId(initialData.logoId || '');
      setWebsiteUrl(initialData.websiteUrl || '');
      setDisplayOrder(initialData.displayOrder || 0);
      setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);

      if (initialData.translations) {
        const transMap = new Map(initialData.translations.map((t: any) => [t.language, t]));
        setTranslations(
          ['en', 'ru', 'arm'].map((lang) => ({
            language: lang as 'en' | 'ru' | 'arm',
            description: transMap.get(lang)?.description || '',
          }))
        );
      }
    }
  }, [initialData]);

  const handleTranslationChange = (index: number, field: keyof Translation, value: string) => {
    const updated = [...translations];
    updated[index] = { ...updated[index], [field]: value };
    setTranslations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name,
        logoId: logoId || undefined,
        websiteUrl: websiteUrl || undefined,
        displayOrder,
        isActive,
        translations: translations.filter((t) => t.description),
      };

      if (mode === 'create') {
        await apiClient.post('/partners', payload);
      } else {
        await apiClient.put(`/partners/${initialData.id}`, payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {mode === 'create' ? 'Create Partner' : 'Edit Partner'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Basic Information" />
          <Tab label="Translations" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Logo ID"
                value={logoId}
                onChange={(e) => setLogoId(e.target.value)}
                helperText="Media ID for partner logo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website URL"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                type="url"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            {translations.map((trans, index) => (
              <Paper key={trans.language} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {trans.language.toUpperCase()} Translation
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={trans.description}
                  onChange={(e) => handleTranslationChange(index, 'description', e.target.value)}
                />
              </Paper>
            ))}
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

