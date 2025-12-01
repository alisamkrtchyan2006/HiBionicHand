'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, CircularProgress, Alert } from '@mui/material';
import ProductForm from '@/components/admin/ProductForm';
import { apiClient } from '@/lib/api/client';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/${productId}?language=en`);
      setProduct(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
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
    <ProductForm
      mode="edit"
      initialData={product}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

