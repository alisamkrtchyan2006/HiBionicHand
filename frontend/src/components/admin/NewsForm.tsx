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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { apiClient } from '@/lib/api/client';

interface Translation {
  language: 'en' | 'ru' | 'arm';
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
}

interface NewsFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NewsForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [featuredImageId, setFeaturedImageId] = useState('');
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);

  const [translations, setTranslations] = useState<Translation[]>([
    { language: 'en', title: '', content: '', excerpt: '', metaTitle: '', metaDescription: '' },
    { language: 'ru', title: '', content: '', excerpt: '', metaTitle: '', metaDescription: '' },
    { language: 'arm', title: '', content: '', excerpt: '', metaTitle: '', metaDescription: '' },
  ]);

  useEffect(() => {
    if (initialData) {
      setSlug(initialData.slug || '');
      setStatus(initialData.status || 'draft');
      setFeaturedImageId(initialData.featuredImageId || '');
      setPublishedAt(initialData.publishedAt ? new Date(initialData.publishedAt) : null);

      if (initialData.translations) {
        const transMap = new Map<string, Translation>(
          initialData.translations.map((t: Translation) => [t.language, t])
        );
        setTranslations(
          ['en', 'ru', 'arm'].map((lang) => {
            const trans = transMap.get(lang);
            return {
              language: lang as 'en' | 'ru' | 'arm',
              title: trans?.title || '',
              content: trans?.content || '',
              excerpt: trans?.excerpt || '',
              metaTitle: trans?.metaTitle || '',
              metaDescription: trans?.metaDescription || '',
            };
          })
        );
      }
    }
  }, [initialData]);

  const handleTranslationChange = (index: number, field: keyof Translation, value: string) => {
    setTranslations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter and format translations properly
      // Check if title and content have actual content (not just whitespace)
      const validTranslations = translations
        .filter((t) => {
          const hasTitle = t.title && t.title.trim().length > 0;
          const hasContent = t.content && t.content.trim().length > 0;
          return hasTitle && hasContent;
        })
        .map((t) => ({
          language: t.language,
          title: t.title.trim(),
          content: t.content.trim(),
          excerpt: t.excerpt?.trim() || undefined,
          metaTitle: t.metaTitle?.trim() || undefined,
          metaDescription: t.metaDescription?.trim() || undefined,
        }));

      if (validTranslations.length === 0) {
        // Debug: Log what we have to help diagnose the issue
        console.log('=== TRANSLATION VALIDATION DEBUG ===');
        console.log('Raw translations state:', JSON.stringify(translations, null, 2));
        console.log('Translation values:', translations.map(t => ({
          lang: t.language,
          title: `"${t.title}" (length: ${t.title?.length || 0})`,
          content: `"${t.content}" (length: ${t.content?.length || 0})`,
          titleTrimmed: t.title?.trim().length || 0,
          contentTrimmed: t.content?.trim().length || 0,
        })));
        console.log('Filtered valid translations:', validTranslations);
        console.log('===================================');
        
        // Find which translations are incomplete for better error message
        const incomplete = translations
          .map((t) => {
            const titleValue = t.title || '';
            const contentValue = t.content || '';
            const hasTitle = titleValue.trim().length > 0;
            const hasContent = contentValue.trim().length > 0;
            const issues = [];
            if (!hasTitle) issues.push('title');
            if (!hasContent) issues.push('content');
            if (issues.length > 0) {
              return `${t.language.toUpperCase()}: missing ${issues.join(' and ')}`;
            }
            return null;
          })
          .filter(Boolean);

        const errorMsg = incomplete.length > 0
          ? `Please fill in both Title and Content for at least one language. Issues: ${incomplete.join(', ')}. Check the browser console for detailed debug information.`
          : 'At least one translation with both title and content is required. Please fill in the Title and Content fields for at least one language (EN, RU, or ARM) in the Translations tab.';

        setError(errorMsg);
        setLoading(false);
        return;
      }

      const payload = {
        slug: slug?.trim() || undefined, // Convert empty string to undefined
        status,
        featuredImageId: featuredImageId?.trim() || undefined, // Convert empty string to undefined
        publishedAt: publishedAt ? publishedAt.toISOString() : undefined,
        translations: validTranslations,
      };

      if (mode === 'create') {
        await apiClient.post('/news', payload);
      } else {
        await apiClient.put(`/news/${initialData.id}`, payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {mode === 'create' ? 'Create News Article' : 'Edit News Article'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Basic Information" />
          <Tab 
            label="Translations (Required)" 
            sx={{ 
              color: activeTab === 1 ? 'inherit' : 'warning.main',
              fontWeight: activeTab === 1 ? 'normal' : 'bold',
            }}
          />
        </Tabs>
        
        {activeTab === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> After filling in the basic information, switch to the <strong>"Translations"</strong> tab to add Title and Content for at least one language (EN, RU, or ARM). This is required to save the article.
            </Typography>
          </Alert>
        )}

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Leave empty to auto-generate from title"
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
                label="Featured Image ID"
                value={featuredImageId}
                onChange={(e) => setFeaturedImageId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Published At"
                type="datetime-local"
                value={publishedAt ? publishedAt.toISOString().slice(0, 16) : ''}
                onChange={(e) => setPublishedAt(e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Required:</strong> At least one translation must have both Title and Content filled in.
                The slug will be auto-generated from the first translation's title if not provided.
              </Typography>
            </Alert>
            {translations.map((trans, index) => {
              const isValid = trans.title.trim() && trans.content.trim();
              return (
                <Paper 
                  key={trans.language} 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    border: isValid ? '2px solid #4caf50' : '2px solid transparent',
                    bgcolor: isValid ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="h6" gutterBottom={false}>
                      {trans.language.toUpperCase()} Translation
                    </Typography>
                    {isValid && (
                      <Typography variant="caption" color="success.main" sx={{ ml: 'auto' }}>
                        ✓ Complete
                      </Typography>
                    )}
                    {!isValid && (
                      <Typography variant="caption" color="error.main" sx={{ ml: 'auto' }}>
                        ⚠ Incomplete
                      </Typography>
                    )}
                  </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Excerpt"
                      value={trans.excerpt}
                      onChange={(e) => handleTranslationChange(index, 'excerpt', e.target.value)}
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
              );
            })}
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

