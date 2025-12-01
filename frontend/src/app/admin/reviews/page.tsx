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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusChip from '@/components/admin/StatusChip';
import { apiClient } from '@/lib/api/client';
import StarIcon from '@mui/icons-material/Star';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  status: string;
  isFeatured: boolean;
  productId: string | null;
  createdAt: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; review: Review | null }>({
    open: false,
    review: null,
  });

  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: page + 1,
        limit: rowsPerPage,
        language: 'en',
      };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await apiClient.get('/reviews', { params });
      setReviews(response.data.data || []);
      setTotalRows(response.data.pagination?.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
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

  const handleEdit = (review: Review) => {
    router.push(`/admin/reviews/${review.id}/edit`);
  };

  const handleDelete = (review: Review) => {
    setDeleteDialog({ open: true, review });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.review) return;

    try {
      await apiClient.delete(`/reviews/${deleteDialog.review.id}`);
      setDeleteDialog({ open: false, review: null });
      fetchReviews();
    } catch (err: any) {
      setError(err.message || 'Failed to delete review');
    }
  };

  const columns: Column[] = [
    { id: 'authorName', label: 'Author', minWidth: 150 },
    {
      id: 'rating',
      label: 'Rating',
      minWidth: 100,
      format: (value) => (
        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon sx={{ color: 'gold', fontSize: 20 }} />
          <Typography>{value}</Typography>
        </Box>
      ),
    },
    { id: 'status', label: 'Status', minWidth: 100, format: (value) => <StatusChip status={value} /> },
    {
      id: 'isFeatured',
      label: 'Featured',
      minWidth: 100,
      format: (value) => (value ? 'Yes' : 'No'),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading && reviews.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Reviews Management</Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        rows={reviews}
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
        onClose={() => setDeleteDialog({ open: false, review: null })}
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, review: null })}>
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

