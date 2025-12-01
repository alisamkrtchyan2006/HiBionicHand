'use client';

/**
 * Dark Mode Usage Example
 * 
 * This component demonstrates how to use dark mode in your components
 */

import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Box, Typography, Paper, Switch, FormControlLabel } from '@mui/material';

export default function DarkModeExample() {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dark Mode Example
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Mode: {mode === 'light' ? 'Light' : 'Dark'}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={toggleMode}
            />
          }
          label="Toggle Dark Mode"
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          The theme automatically adapts based on the mode. All Material-UI
          components will use the appropriate colors for light or dark mode.
        </Typography>
      </Paper>
    </Box>
  );
}

