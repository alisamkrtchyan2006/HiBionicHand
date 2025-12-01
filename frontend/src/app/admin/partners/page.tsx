'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusChip from '@/components/admin/StatusChip';
import { apiClient } from '@/lib/api/client';

interface Partner {
  id: string;
  name: string;
  websiteUrl: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function PartnersPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; partner: Partner | null }>({
    open: false,
    partner: null,
  });

  useEffect(() => {
    fetchPartners();
  }, [page, rowsPerPage]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/partners', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          language: 'en',
        },
      });
      setPartners(response.data.data || []);
      setTotalRows(response.data.pagination?.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (partner: Partner) => {
    router.push(`/admin/partners/${partner.id}/edit`);
  };

  const handleDelete = (partner: Partner) => {
    setDeleteDialog({ open: true, partner });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.partner) return;

    try {
      await apiClient.delete(`/partners/${deleteDialog.partner.id}`);
      setDeleteDialog({ open: false, partner: null });
      fetchPartners();
    } catch (err: any) {
      setError(err.message || 'Failed to delete partner');
    }
  };

  const columns: Column[] = [
    { id: 'name', label: 'Name', minWidth: 200 },
    {
      id: 'websiteUrl',
      label: 'Website',
      minWidth: 200,
      format: (value) => (value ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : 'N/A'),
    },
    { id: 'displayOrder', label: 'Order', minWidth: 80 },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      format: (value) => <StatusChip status={value ? 'active' : 'inactive'} />,
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading && partners.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Partners Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/partners/new')}
        >
          Add Partner
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        rows={partners}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, partner: null })}
      >
        <DialogTitle>Delete Partner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this partner? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, partner: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

