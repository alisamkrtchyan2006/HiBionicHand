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
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiClient } from '@/lib/api/client';

interface Translation {
  language: 'en' | 'ru' | 'arm';
  name: string;
  description: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
}

interface Spec {
  specKey: string;
  specValue: string;
  displayOrder: number;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Basic fields
  const [parentId, setParentId] = useState('');
  const [type, setType] = useState<'upper_limb' | 'lower_limb'>('upper_limb');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [featuredImageId, setFeaturedImageId] = useState('');

  // Translations
  const [translations, setTranslations] = useState<Translation[]>([
    { language: 'en', name: '', description: '', shortDescription: '', metaTitle: '', metaDescription: '' },
    { language: 'ru', name: '', description: '', shortDescription: '', metaTitle: '', metaDescription: '' },
    { language: 'arm', name: '', description: '', shortDescription: '', metaTitle: '', metaDescription: '' },
  ]);

  // Specs
  const [specs, setSpecs] = useState<Spec[]>([]);

  useEffect(() => {
    if (initialData) {
      setParentId(initialData.parentId || '');
      setType(initialData.type || 'upper_limb');
      setSlug(initialData.slug || '');
      setSku(initialData.sku || '');
      setStatus(initialData.status || 'draft');
      setFeaturedImageId(initialData.featuredImageId || '');

      if (initialData.translations) {
        const transMap = new Map<string, Translation>(
          initialData.translations.map((t: Translation) => [t.language, t])
        );
        setTranslations(
          ['en', 'ru', 'arm'].map((lang) => {
            const trans = transMap.get(lang);
            return {
              language: lang as 'en' | 'ru' | 'arm',
              name: trans?.name || '',
              description: trans?.description || '',
              shortDescription: trans?.shortDescription || '',
              metaTitle: trans?.metaTitle || '',
              metaDescription: trans?.metaDescription || '',
            };
          })
        );
      }

      if (initialData.specs) {
        setSpecs(initialData.specs.map((s: any) => ({
          specKey: s.specKey,
          specValue: s.specValue,
          displayOrder: s.displayOrder || 0,
        })));
      }
    }
  }, [initialData]);

  const handleTranslationChange = (index: number, field: keyof Translation, value: string) => {
    const updated = [...translations];
    updated[index] = { ...updated[index], [field]: value };
    setTranslations(updated);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { specKey: '', specValue: '', displayOrder: specs.length }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: keyof Spec, value: string | number) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    setSpecs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        // Remove categoryId as it doesn't exist in schema
        parentId: parentId || undefined,
        type,
        slug: slug || undefined,
        sku: sku || undefined,
        status,
        featuredImageId: featuredImageId || undefined,
        translations: translations.filter((t) => t.name).map((t) => ({
          language: t.language,
          name: t.name,
          description: t.description || undefined,
          shortDescription: t.shortDescription || undefined,
          metaTitle: t.metaTitle || undefined,
          metaDescription: t.metaDescription || undefined,
        })),
        specs: specs.filter((s) => s.specKey && s.specValue).map((s) => ({
          specKey: s.specKey,
          specValue: s.specValue,
          displayOrder: s.displayOrder,
        })),
      };

      if (mode === 'create') {
        await apiClient.post('/products', payload);
      } else {
        await apiClient.put(`/products/${initialData.id}`, payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Basic Information" />
          <Tab label="Translations" />
          <Tab label="Specifications" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value as any)}>
                  <MenuItem value="upper_limb">Upper Limb</MenuItem>
                  <MenuItem value="lower_limb">Lower Limb</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Leave empty to auto-generate from name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Parent Product ID"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Featured Image ID"
                value={featuredImageId}
                onChange={(e) => setFeaturedImageId(e.target.value)}
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
                      required
                      label="Name"
                      value={trans.name}
                      onChange={(e) => handleTranslationChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={trans.description}
                      onChange={(e) => handleTranslationChange(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Short Description"
                      value={trans.shortDescription}
                      onChange={(e) => handleTranslationChange(index, 'shortDescription', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Meta Title"
                      value={trans.metaTitle}
                      onChange={(e) => handleTranslationChange(index, 'metaTitle', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Meta Description"
                      value={trans.metaDescription}
                      onChange={(e) => handleTranslationChange(index, 'metaDescription', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Specifications</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddSpec}
              >
                Add Spec
              </Button>
            </Box>
            {specs.map((spec, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Key"
                      value={spec.specKey}
                      onChange={(e) => handleSpecChange(index, 'specKey', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      multiline
                      label="Value"
                      value={spec.specValue}
                      onChange={(e) => handleSpecChange(index, 'specValue', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Order"
                      value={spec.displayOrder}
                      onChange={(e) => handleSpecChange(index, 'displayOrder', parseInt(e.target.value) || 0)}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveSpec(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {specs.length === 0 && (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No specifications added. Click "Add Spec" to add one.
              </Typography>
            )}
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

