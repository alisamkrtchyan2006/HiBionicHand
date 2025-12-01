'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import ReviewForm from '@/components/admin/ReviewForm';
import { apiClient } from '@/lib/api/client';

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id as string;
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/reviews/${reviewId}?language=en`);
      setReview(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch review');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/reviews');
  };

  const handleCancel = () => {
    router.push('/admin/reviews');
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
    <ReviewForm
      mode="edit"
      initialData={review}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

