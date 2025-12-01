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

interface News {
  id: string;
  slug: string;
  status: string;
  viewsCount: number;
  translations: Array<{
    language: string;
    title: string;
  }>;
  createdAt: string;
  publishedAt: string | null;
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; news: News | null }>({
    open: false,
    news: null,
  });

  useEffect(() => {
    fetchNews();
  }, [page, rowsPerPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/news', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          language: 'en',
        },
      });
      setNews(response.data.data || []);
      setTotalRows(response.data.pagination?.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
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

  const handleEdit = (item: News) => {
    router.push(`/admin/news/${item.id}/edit`);
  };

  const handleDelete = (item: News) => {
    setDeleteDialog({ open: true, news: item });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.news) return;

    try {
      await apiClient.delete(`/news/${deleteDialog.news.id}`);
      setDeleteDialog({ open: false, news: null });
      fetchNews();
    } catch (err: any) {
      setError(err.message || 'Failed to delete news');
    }
  };

  const columns: Column[] = [
    {
      id: 'translations',
      label: 'Title',
      minWidth: 250,
      format: (value) => {
        const enTranslation = value?.find((t: any) => t.language === 'en');
        return enTranslation?.title || 'N/A';
      },
    },
    { id: 'slug', label: 'Slug', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100, format: (value) => <StatusChip status={value} /> },
    { id: 'viewsCount', label: 'Views', minWidth: 80 },
    {
      id: 'publishedAt',
      label: 'Published',
      minWidth: 150,
      format: (value) => (value ? new Date(value).toLocaleDateString() : 'Not published'),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading && news.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">News Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/news/new')}
        >
          Add News
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        rows={news}
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
        onClose={() => setDeleteDialog({ open: false, news: null })}
      >
        <DialogTitle>Delete News Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this news article? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, news: null })}>
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

