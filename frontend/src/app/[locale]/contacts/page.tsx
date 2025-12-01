'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  ContactMail as ContactMailIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { apiClient } from '@/lib/api/client';
import { useTranslations } from 'next-intl';

interface Contact {
  id: string;
  type: string;
  value: string;
  translations: Array<{
    language: string;
    label: string;
  }>;
}

export default function ContactPage() {
  const t = useTranslations();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await apiClient.get('/contacts', {
        params: {
          language: 'en',
          isActive: true,
        },
      });
      setContacts(response.data.data || []);
    } catch (err: any) {
      // Use dummy data on error
      // setContacts(getDummyContacts());
    }
  };

  // const getDummyContacts = (): Contact[] => [
  //   {
  //     id: '1',
  //     type: 'email',
  //     value: 'info@hibionichand.com',
  //     translations: [{ language: 'en', label: 'Email' }],
  //   },
  //   {
  //     id: '2',
  //     type: 'phone',
  //     value: '+1 (555) 123-4567',
  //     translations: [{ language: 'en', label: 'Phone' }],
  //   },
  //   {
  //     id: '3',
  //     type: 'address',
  //     value: '123 Innovation Drive, Tech City, TC 12345, United States',
  //     translations: [{ language: 'en', label: 'Address' }],
  //   },
  // ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiClient.post('/contacts/submit', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getContactLabel = (contact: Contact) => {
    const enTranslation = contact.translations?.find((t) => t.language === 'en');
    return enTranslation?.label || contact.type;
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'phone':
        return <PhoneIcon />;
      case 'address':
        return <LocationIcon />;
      default:
        return <ContactMailIcon />;
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <ContactMailIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
            }}
          >
            {t('contact.title')}
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '700px', mx: 'auto' }}>
          {t('contact.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h4" fontWeight={600} gutterBottom>
              {t('contact.sendMessage')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t('contact.formDesc')}
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {t('contact.success')}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label={t('contact.name')}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label={t('contact.email')}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="tel"
                      label={t('contact.phone')}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('contact.subject')}
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={6}
                      label={t('contact.message')}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      disabled={loading}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      {loading ? t('contact.sending') : t('contact.send')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {t('contact.getInTouch')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t('contact.getInTouchDesc')}
              </Typography>

              {/* Contact Cards */}
              <Box sx={{ mb: 4 }}>
                {contacts.map((contact) => (
                  <Card key={contact.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 1.5,
                            borderRadius: 1,
                            mr: 2,
                          }}
                        >
                          {getContactIcon(contact.type)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {getContactLabel(contact)}
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {contact.value}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Social Media */}
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('contact.followUs')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton
                    color="primary"
                    sx={{
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' },
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    sx={{
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' },
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    sx={{
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' },
                    }}
                  >
                    <LinkedInIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    sx={{
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' },
                    }}
                  >
                    <InstagramIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Business Hours */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('contact.businessHours')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Monday - Friday</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      9:00 AM - 6:00 PM
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Saturday</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      10:00 AM - 4:00 PM
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Sunday</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {t('contact.closed')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

