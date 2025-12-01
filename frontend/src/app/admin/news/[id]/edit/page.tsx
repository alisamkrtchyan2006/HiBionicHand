'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import NewsForm from '@/components/admin/NewsForm';
import { apiClient } from '@/lib/api/client';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [newsId]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/news/${newsId}?language=en`);
      setNews(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/news');
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <NewsForm
      mode="edit"
      initialData={news}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

