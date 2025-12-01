'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Rating,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { apiClient } from '@/lib/api/client';

interface Translation {
  language: 'en' | 'ru' | 'arm';
  title: string;
  content: string;
}

interface ReviewFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [productId, setProductId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isFeatured, setIsFeatured] = useState(false);

  const [translations, setTranslations] = useState<Translation[]>([
    { language: 'en', title: '', content: '' },
    { language: 'ru', title: '', content: '' },
    { language: 'arm', title: '', content: '' },
  ]);

  useEffect(() => {
    if (initialData) {
      setProductId(initialData.productId || '');
      setAuthorName(initialData.authorName || '');
      setAuthorEmail(initialData.authorEmail || '');
      setAuthorAvatarUrl(initialData.authorAvatarUrl || '');
      setRating(initialData.rating || 5);
      setStatus(initialData.status || 'pending');
      setIsFeatured(initialData.isFeatured || false);

      if (initialData.translations) {
        const transMap = new Map(initialData.translations.map((t: any) => [t.language, t]));
        setTranslations(
          ['en', 'ru', 'arm'].map((lang) => ({
            language: lang as 'en' | 'ru' | 'arm',
            title: transMap.get(lang)?.title || '',
            content: transMap.get(lang)?.content || '',
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
        productId: productId || undefined,
        status,
        isFeatured,
        translations: translations.filter((t) => t.content),
      };

      if (mode === 'create') {
        await apiClient.post('/reviews', {
          ...payload,
          authorName,
          authorEmail: authorEmail || undefined,
          authorAvatarUrl: authorAvatarUrl || undefined,
          rating,
        });
      } else {
        await apiClient.put(`/reviews/${initialData.id}`, payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {mode === 'create' ? 'Create Review' : 'Edit Review'}
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
            {mode === 'create' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Author Name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Author Email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Author Avatar URL"
                    value={authorAvatarUrl}
                    onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue || 5);
                      }}
                    />
                  </Box>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                }
                label="Featured Review"
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={trans.title}
                      onChange={(e) => handleTranslationChange(index, 'title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      required
                      label="Content"
                      value={trans.content}
                      onChange={(e) => handleTranslationChange(index, 'content', e.target.value)}
                    />
                  </Grid>
                </Grid>
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

