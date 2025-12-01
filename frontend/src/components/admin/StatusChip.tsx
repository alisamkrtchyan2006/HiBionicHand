import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
}

export default function StatusChip({ status }: StatusChipProps) {
  const getColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'published':
      case 'approved':
      case 'active':
        return 'success';
      case 'draft':
      case 'pending':
        return 'warning';
      case 'archived':
      case 'rejected':
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getColor(status)}
      size="small"
    />
  );
}

