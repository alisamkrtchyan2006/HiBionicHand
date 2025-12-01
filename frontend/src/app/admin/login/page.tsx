'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Store token - API returns { success: true, data: { accessToken, ... } }
      if (response.data.data?.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
      } else if (response.data.accessToken) {
        // Fallback for different response structure
        localStorage.setItem('token', response.data.accessToken);
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(26, 26, 36, 0.9)' : 'white',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access the admin panel
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{
                py: 1.5,
                mb: 2,
                fontWeight: 600,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center' }}
            >
              For demo purposes, you can use any credentials if backend is configured
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

