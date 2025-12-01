import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Box } from '@mui/material';
import { routing } from '@/i18n/routing';
import { ThemeContextProvider } from '@/contexts/ThemeContext';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  // Don't include html/body here - root layout handles it
  // This is a nested layout
  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeContextProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          <Footer />
        </Box>
      </ThemeContextProvider>
    </NextIntlClientProvider>
  );
}

