'use client';

import { useRouter } from 'next/navigation';
import PartnerForm from '@/components/admin/PartnerForm';

export default function NewPartnerPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/partners');
  };

  const handleCancel = () => {
    router.push('/admin/partners');
  };

  return (
    <PartnerForm
      mode="create"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}

