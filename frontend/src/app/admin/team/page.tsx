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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataTable, { Column } from '@/components/admin/DataTable';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function TeamPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setUsers(response.data.data || []);
      setTotalRows(response.data.pagination?.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
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

  const handleEdit = (user: User) => {
    router.push(`/admin/team/${user.id}/edit`);
  };

  const handleDelete = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.user) return;

    try {
      await apiClient.delete(`/users/${deleteDialog.user.id}`);
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const columns: Column[] = [
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'name',
      label: 'Name',
      minWidth: 150,
      format: (value, row) => {
        if (!row) return 'N/A';
        const firstName = row.firstName || '';
        const lastName = row.lastName || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      },
    },
    {
      id: 'role',
      label: 'Role',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          color={value === 'admin' ? 'primary' : value === 'editor' ? 'secondary' : 'default'}
          size="small"
        />
      ),
    },
    {
      id: 'isActive',
      label: 'Status',
      minWidth: 100,
      format: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 150,
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Team Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/team/new')}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <DataTable
        columns={columns}
        rows={users}
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
        onClose={() => setDeleteDialog({ open: false, user: null })}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>
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

