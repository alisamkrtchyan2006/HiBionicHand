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

interface Product {
  id: string;
  slug: string;
  type: string;
  status: string;
  translations: Array<{
    language: string;
    name: string;
  }>;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/products', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          language: 'en',
        },
      });
      setProducts(response.data.data || []);
      setTotalRows(response.data.pagination?.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
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

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.product) return;

    try {
      await apiClient.delete(`/products/${deleteDialog.product.id}`);
      setDeleteDialog({ open: false, product: null });
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const columns: Column[] = [
    { id: 'translations', label: 'Name', minWidth: 200, format: (value) => {
      const enTranslation = value?.find((t: any) => t.language === 'en');
      return enTranslation?.name || 'N/A';
    }},
    { id: 'slug', label: 'Slug', minWidth: 150 },
    { id: 'type', label: 'Type', minWidth: 100, format: (value) => value?.replace('_', ' ').toUpperCase() },
    { id: 'status', label: 'Status', minWidth: 100, format: (value) => <StatusChip status={value} /> },
    { id: 'createdAt', label: 'Created', minWidth: 150, format: (value) => new Date(value).toLocaleDateString() },
  ];

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Products Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/products/new')}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        rows={products}
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
        onClose={() => setDeleteDialog({ open: false, product: null })}
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, product: null })}>
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

