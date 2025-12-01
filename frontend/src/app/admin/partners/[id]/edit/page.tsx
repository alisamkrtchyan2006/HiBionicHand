'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import PartnerForm from '@/components/admin/PartnerForm';
import { apiClient } from '@/lib/api/client';

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPartner();
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/partners/${partnerId}?language=en`);
      setPartner(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch partner');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/partners');
  };

  const handleCancel = () => {
    router.push('/admin/partners');
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
    <PartnerForm
      mode="edit"
      initialData={partner}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

