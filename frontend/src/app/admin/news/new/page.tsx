'use client';

import { useRouter } from 'next/navigation';
import NewsForm from '@/components/admin/NewsForm';

export default function NewNewsPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/news');
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  return (
    <NewsForm
      mode="create"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

