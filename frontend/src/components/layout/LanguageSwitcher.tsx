'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'arm', name: 'Հայերեն', flag: '🇦🇲' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    handleClose();
    // pathname from usePathname() includes locale (e.g., /en/products)
    // Extract path without locale and add new locale
    const pathWithoutLocale = pathname.replace(/^\/[^/]+/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'inherit',
        }}
        aria-label="Change language"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === locale}
          >
            <ListItemIcon>
              <span style={{ fontSize: '1.2rem' }}>{language.flag}</span>
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
            {language.code === locale && (
              <CheckIcon fontSize="small" sx={{ ml: 2 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

