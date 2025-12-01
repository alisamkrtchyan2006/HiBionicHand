# Dark Mode Usage Guide

## Overview

Dark mode is fully integrated using Material-UI's theme system with automatic persistence.

## How It Works

1. **ThemeContext** - Manages theme state and persistence
2. **ThemeProvider** - Wraps the app with MUI ThemeProvider
3. **ThemeToggle** - Component to switch between light/dark modes
4. **LocalStorage** - Saves user preference

## Usage

### Access Theme Mode

```tsx
'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function MyComponent() {
  const { mode, toggleMode } = useContext(ThemeContext);
  
  return (
    <Box>
      <Typography>Current mode: {mode}</Typography>
      <Button onClick={toggleMode}>Toggle Theme</Button>
    </Box>
  );
}
```

### Use ThemeToggle Component

The `ThemeToggle` component is already in the Header:

```tsx
import ThemeToggle from '@/components/layout/ThemeToggle';

<ThemeToggle />
```

### Custom Styling Based on Mode

```tsx
import { useTheme } from '@mui/material/styles';

export default function MyComponent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box
      sx={{
        bgcolor: isDark ? 'grey.900' : 'grey.100',
        color: isDark ? 'white' : 'black',
      }}
    >
      Content
    </Box>
  );
}
```

## Theme Configuration

Themes are defined in `src/contexts/ThemeContext.tsx`:
- `lightTheme` - Light mode theme
- `darkTheme` - Dark mode theme

Both themes share the same structure but with different color palettes.

## Persistence

The theme preference is saved to `localStorage` with the key `themeMode` and persists across page reloads.

## System Preference

On first visit, the theme defaults to the user's system preference (if available), otherwise defaults to light mode.

