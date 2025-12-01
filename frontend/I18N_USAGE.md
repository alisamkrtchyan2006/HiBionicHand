# i18n (Internationalization) Usage Guide

## Overview

The frontend uses `next-intl` for multilanguage support with three languages:
- **English (en)** - Default
- **Russian (ru)**
- **Armenian (arm)**

## Installation

The package is already installed. If you need to reinstall:

```bash
cd frontend
npm install next-intl
```

## File Structure

```
frontend/
├── messages/
│   ├── en.json      # English translations
│   ├── ru.json      # Russian translations
│   └── arm.json     # Armenian translations
├── src/
│   ├── i18n/
│   │   ├── config.ts      # i18n configuration
│   │   ├── request.ts      # Request config
│   │   └── routing.ts      # Routing configuration
│   └── middleware.ts      # Locale detection middleware
```

## URL Structure

The locale is part of the URL:
- `/en/products` - English
- `/ru/products` - Russian
- `/arm/products` - Armenian

Default locale (en) can also be accessed without prefix: `/products` → `/en/products`

## Usage in Components

### Basic Usage

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  
  return (
    <Typography>{t('common.home')}</Typography>
  );
}
```

### Namespaced Translations (Recommended)

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const tCommon = useTranslations('common');
  const tHome = useTranslations('home');
  
  return (
    <Box>
      <Typography>{tCommon('home')}</Typography>
      <Typography>{tHome('title')}</Typography>
    </Box>
  );
}
```

### In Server Components

```tsx
import { useTranslations } from 'next-intl';

export default async function MyServerComponent() {
  const t = await useTranslations();
  
  return <Typography>{t('common.home')}</Typography>;
}
```

## Navigation with Locale

```tsx
'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { Link } from '@/i18n/routing';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Navigate programmatically
  router.push('/products');
  
  // Use Link component (preserves locale)
  return <Link href="/products">Products</Link>;
}
```

## Language Switcher Component

The `LanguageSwitcher` component is already integrated in the Header:

```tsx
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

// Already in Header component
<LanguageSwitcher />
```

## Adding New Translations

1. **Add to all language files** (`messages/en.json`, `messages/ru.json`, `messages/arm.json`):

```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

2. **Use in component**:

```tsx
const t = useTranslations('mySection');
<Typography>{t('myKey')}</Typography>
```

## Translation Keys Structure

```
common.*          - Common UI elements
home.*            - Homepage content
about.*           - About page
products.*        - Products page
news.*            - News page
reviews.*         - Reviews page
partners.*        - Partners page
contact.*         - Contact page
admin.*           - Admin panel
tech.*            - Technology features
team.*            - Team members
```

## Dark Mode Integration

Dark mode is integrated with the theme system:

```tsx
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function MyComponent() {
  const { mode, toggleMode } = useContext(ThemeContext);
  
  return (
    <Button onClick={toggleMode}>
      {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
    </Button>
  );
}
```

The `ThemeToggle` component is already in the Header.

## Best Practices

1. **Use namespaced translations** for better organization
2. **Keep translation keys descriptive** and hierarchical
3. **Always add translations to all three languages**
4. **Use the routing utilities** from `@/i18n/routing` for navigation
5. **Test all languages** to ensure proper display

## Example: Complete Component

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button, Typography } from '@mui/material';

export default function ExamplePage() {
  const t = useTranslations();
  const router = useRouter();
  
  return (
    <Box>
      <Typography variant="h1">
        {t('home.title')}
      </Typography>
      <Button onClick={() => router.push('/products')}>
        {t('home.exploreProducts')}
      </Button>
    </Box>
  );
}
```

## Troubleshooting

### Translations not showing
- Check that the key exists in all language files
- Verify the namespace is correct
- Check browser console for errors

### Locale not changing
- Clear browser cache
- Check middleware configuration
- Verify routing setup

### Dark mode not working
- Check ThemeContextProvider is wrapping the app
- Verify localStorage is accessible
- Check theme configuration

