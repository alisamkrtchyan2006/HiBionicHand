'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  return (
    <ProductForm
      mode="create"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

